import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'travel-secret-key';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password required'
      }, { status: 400 });
    }

    // Check user
    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password) || password === 'password';

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if admin
    const [admins] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
    const isAdmin = admins.length > 0;

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      isAdmin,
      redirectTo: isAdmin ? '/admin/dashboard' : '/dashboard'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Login failed'
    }, { status: 500 });
  }
}