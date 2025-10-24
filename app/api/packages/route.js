import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const destination = searchParams.get('destination');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const duration = searchParams.get('duration');
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ? OR d.name LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (destination && destination !== 'all') {
      whereConditions.push('d.name = ?');
      queryParams.push(destination);
    }

    if (priceMin) {
      whereConditions.push('p.price >= ?');
      queryParams.push(parseFloat(priceMin));
    }

    if (priceMax) {
      whereConditions.push('p.price <= ?');
      queryParams.push(parseFloat(priceMax));
    }

    if (duration && duration !== 'all') {
      if (duration === '10') {
        whereConditions.push('p.duration >= ?');
        queryParams.push(10);
      } else {
        whereConditions.push('p.duration = ?');
        queryParams.push(parseInt(duration));
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['id', 'name', 'price', 'duration', 'rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? `p.${sortBy}` : 'p.id';
    const orderDirection = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const packages = await query(`
      SELECT 
        p.*,
        d.name as destination_name,
        d.country,
        d.latitude,
        d.longitude,
        d.image_url as destination_image_url
      FROM TripPackage p
      JOIN Destination d ON p.destination_id = d.id
      ${whereClause}
      ORDER BY p.is_featured DESC, ${sortColumn} ${orderDirection}
    `, queryParams);

    const packagesWithDestinations = packages.map(pkg => ({
      ...pkg,
      destinations: [{
        id: pkg.destination_id,
        name: pkg.destination_name,
        country: pkg.country,
        latitude: pkg.latitude,
        longitude: pkg.longitude,
        image_url: pkg.destination_image_url
      }]
    }));

    return NextResponse.json({
      packages: packagesWithDestinations
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch packages'
    }, { status: 500 });
  }
}