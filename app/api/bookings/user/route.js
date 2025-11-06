import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
    
    const sql = `
      SELECT 
        b.id AS BookingID,
        b.user_id AS UserID,
        b.package_id AS PackageID,
        b.hotel_id AS HotelID,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS BookingDate,
        DATE_FORMAT(b.travel_date, '%Y-%m-%d') AS TravelDate,
        DATE_FORMAT(b.return_date, '%Y-%m-%d') AS ReturnDate,
        b.num_travelers AS NumTravelers,
        b.total_price AS TotalAmount,
        b.status AS Status,
        b.special_requests AS SpecialRequests,
        p.name AS PackageTitle,
        p.description AS PackageDescription,
        d.name AS DestinationName,
        d.country AS Country,
        h.name AS HotelName,
        h.star_rating AS HotelRating,
        pay.status AS PaymentStatus,
        pay.payment_method AS PaymentMethod
      FROM 
        Booking b
      JOIN TripPackage p ON b.package_id = p.id
      JOIN Destination d ON p.destination_id = d.id
      LEFT JOIN Hotel h ON b.hotel_id = h.id
      LEFT JOIN Payment pay ON b.id = pay.booking_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;
    
    const bookings = await query(sql, [userId]);
    
    return NextResponse.json({
      success: true,
      bookings
    });
    
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}