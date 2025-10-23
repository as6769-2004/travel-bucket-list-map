import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const [destinations] = await pool.query(`
      SELECT 
        d.id,
        d.name,
        d.country,
        d.description,
        d.image_url,
        d.latitude,
        d.longitude,
        d.popularity_score,
        COUNT(p.id) as package_count
      FROM Destination d
      LEFT JOIN TripPackage p ON d.id = p.destination_id
      GROUP BY d.id
      ORDER BY d.popularity_score DESC
    `);

    return NextResponse.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch destinations'
    }, { status: 500 });
  }
}
