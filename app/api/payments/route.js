import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const { bookingId, mode, amount } = await request.json();

    if (!bookingId || !mode || !amount) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Create payment record
    const [paymentResult] = await pool.query(
      `INSERT INTO Payment (booking_id, amount, payment_method, transaction_id, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [bookingId, amount, mode, `TXN${Date.now()}`]
    );

    // Update booking status to confirmed
    await pool.query(
      'UPDATE Booking SET status = ? WHERE id = ?',
      ['confirmed', bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: { 
        paymentId: paymentResult.insertId,
        transactionId: `TXN${Date.now()}`,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({
      success: false,
      message: 'Payment processing failed'
    }, { status: 500 });
  }
}