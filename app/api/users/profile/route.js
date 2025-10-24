import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const users = await query(
      `SELECT id, username, email, full_name, phone, date_of_birth, gender,
       address, city, state, country, pincode, profile_picture,
       emergency_contact_name, emergency_contact_phone, travel_preferences,
       is_verified, created_at, updated_at FROM User WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];
    if (user.travel_preferences) {
      try {
        user.travel_preferences = JSON.parse(user.travel_preferences);
      } catch (e) {
        user.travel_preferences = {};
      }
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const {
      userId,
      username,
      full_name,
      phone,
      date_of_birth,
      gender,
      address,
      city,
      state,
      pincode,
      emergency_contact_name,
      emergency_contact_phone,
      travel_preferences,
      currentPassword,
      newPassword
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await query('SELECT password FROM User WHERE id = ?', [userId]);
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let updateFields = [];
    let updateValues = [];

    // Handle password change
    if (newPassword && currentPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedNewPassword);
    }

    // Update other fields
    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (date_of_birth) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth);
    }
    if (gender) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (city) {
      updateFields.push('city = ?');
      updateValues.push(city);
    }
    if (state) {
      updateFields.push('state = ?');
      updateValues.push(state);
    }
    if (pincode) {
      updateFields.push('pincode = ?');
      updateValues.push(pincode);
    }
    if (emergency_contact_name) {
      updateFields.push('emergency_contact_name = ?');
      updateValues.push(emergency_contact_name);
    }
    if (emergency_contact_phone) {
      updateFields.push('emergency_contact_phone = ?');
      updateValues.push(emergency_contact_phone);
    }
    if (travel_preferences) {
      updateFields.push('travel_preferences = ?');
      updateValues.push(JSON.stringify(travel_preferences));
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(userId);

    await query(
      `UPDATE User SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Fetch updated user data
    const updatedUsers = await query(
      `SELECT id, username, email, full_name, phone, date_of_birth, gender,
       address, city, state, country, pincode, profile_picture,
       emergency_contact_name, emergency_contact_phone, travel_preferences,
       is_verified, created_at, updated_at FROM User WHERE id = ?`,
      [userId]
    );

    const updatedUser = updatedUsers[0];
    if (updatedUser.travel_preferences) {
      try {
        updatedUser.travel_preferences = JSON.parse(updatedUser.travel_preferences);
      } catch (e) {
        updatedUser.travel_preferences = {};
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}