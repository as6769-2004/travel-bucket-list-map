import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { full_name, username, email, password } = await request.json();

    if (!full_name || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUsers = await query('SELECT id FROM User WHERE email = ? OR username = ?', [email, username]);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO User (username, email, password, full_name, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, hashedPassword, full_name]
    );

    const newUsers = await query(
      'SELECT id, username, full_name, email, created_at FROM User WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      user: newUsers[0],
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}