import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { username, email, password, full_name, phone } = await request.json();

    if (!username || !email || !password || !full_name) {
      return NextResponse.json({
        success: false,
        message: 'Required fields: username, email, password, full_name'
      }, { status: 400 });
    }

    const [existing] = await pool.query(
      'SELECT id FROM User WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'User already exists'
      }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO User (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, phone]
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      userId: result.insertId
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Registration failed'
    }, { status: 500 });
  }
}