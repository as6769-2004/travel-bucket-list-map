import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalBookings = await query('SELECT COUNT(*) as count FROM Booking');
    const totalRevenue = await query('SELECT SUM(total_price) as total FROM Booking');
    const totalUsers = await query('SELECT COUNT(*) as count FROM User');

    return NextResponse.json({
      stats: {
        TotalBookings: totalBookings[0].count || 0,
        TotalRevenue: totalRevenue[0].total || 0,
        TotalUsers: totalUsers[0].count || 0
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      stats: {
        TotalBookings: 0,
        TotalRevenue: 0,
        TotalUsers: 0
      }
    });
  }
}