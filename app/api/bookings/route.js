import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { 
      packageId, hotelId, travelDate, returnDate, numTravelers, totalPrice, 
      specialRequests, fullName, email, phone 
    } = await request.json();

    if (!packageId || !travelDate || !returnDate || !numTravelers || !totalPrice || !email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Get user ID from email
    const users = await query('SELECT id FROM User WHERE email = ?', [email]);
    let userId;
    
    if (users.length > 0) {
      userId = users[0].id;
    } else {
      // Create new user
      const username = email.split('@')[0];
      const userResult = await query(
        'INSERT INTO User (username, full_name, email, phone, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, fullName, email, phone]
      );
      userId = userResult.insertId;
    }

    const result = await query(
      `INSERT INTO Booking (user_id, package_id, hotel_id, booking_date, travel_date, return_date, num_travelers, total_price, special_requests, status, created_at) 
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId, packageId, hotelId, travelDate, returnDate, numTravelers, totalPrice, specialRequests]
    );

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create booking'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let queryStr = `
      SELECT 
        b.*,
        u.full_name as user_name,
        p.name as package_name,
        h.name as hotel_name
      FROM Booking b
      JOIN User u ON b.user_id = u.id
      JOIN TripPackage p ON b.package_id = p.id
      LEFT JOIN Hotel h ON b.hotel_id = h.id
    `;
    
    const params = [];
    
    if (userId) {
      queryStr += ' WHERE b.user_id = ?';
      params.push(userId);
    }
    
    queryStr += ' ORDER BY b.created_at DESC';

    const bookings = await query(queryStr, params);

    return NextResponse.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings'
    }, { status: 500 });
  }
}