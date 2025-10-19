import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const userId = params.id;

    const [bookings] = await pool.query(`
      SELECT 
        b.id AS booking_id,
        b.booking_date,
        b.travel_date,
        b.return_date,
        b.num_travelers,
        b.total_price,
        b.status,
        b.special_requests,
        p.name AS package_name,
        p.description AS package_description,
        p.duration,
        h.name AS hotel_name,
        h.star_rating,
        t.provider AS transport_provider,
        t.type AS transport_type,
        d.name AS destination_name,
        d.country
      FROM Booking b
      JOIN TripPackage p ON b.package_id = p.id
      LEFT JOIN Hotel h ON b.hotel_id = h.id
      LEFT JOIN Transport t ON b.transport_id = t.id
      JOIN Destination d ON p.destination_id = d.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings'
    }, { status: 500 });
  }
}