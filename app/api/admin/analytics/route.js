import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Total bookings
    const [totalBookingsResult] = await pool.query('SELECT COUNT(*) as count FROM Booking');
    const totalBookings = totalBookingsResult[0].count;

    // Total revenue
    const [totalRevenueResult] = await pool.query('SELECT SUM(total_price) as revenue FROM Booking WHERE status = "confirmed"');
    const totalRevenue = parseFloat(totalRevenueResult[0].revenue || 0);

    // Total users
    const [totalUsersResult] = await pool.query('SELECT COUNT(*) as count FROM User');
    const totalUsers = totalUsersResult[0].count;

    // Most popular packages (JOIN query)
    const [popularPackages] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        COUNT(b.id) as booking_count
      FROM TripPackage p
      LEFT JOIN Booking b ON p.id = b.package_id
      GROUP BY p.id, p.name
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    // Revenue by package (JOIN query)
    const [revenueByPackage] = await pool.query(`
      SELECT 
        p.name,
        SUM(b.total_price) as revenue
      FROM TripPackage p
      LEFT JOIN Booking b ON p.id = b.package_id AND b.status = 'confirmed'
      GROUP BY p.id, p.name
      HAVING revenue > 0
      ORDER BY revenue DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        totalUsers,
        popularPackages,
        revenueByPackage: revenueByPackage.map(item => ({
          name: item.name,
          revenue: parseFloat(item.revenue || 0)
        }))
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analytics'
    }, { status: 500 });
  }
}