import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Build the SQL query
    const sql = `
      SELECT 
        p.id AS PackageID,
        p.name AS Title,
        p.destination_id AS DestinationID,
        p.description AS Description,
        p.duration AS Duration,
        p.price AS Price,
        p.includes_flight AS IncludesFlight,
        p.includes_hotel AS IncludesHotel,
        p.includes_meals AS IncludesMeals,
        p.includes_activities AS IncludesActivities,
        p.rating AS Rating,
        p.is_featured AS IsFeatured,
        p.max_travelers AS MaxTravelers,
        d.name AS DestinationName,
        d.country AS Country,
        p.image_url AS ImageURL
      FROM 
        TripPackage p
      JOIN 
        Destination d ON p.destination_id = d.id
      WHERE 
        p.id = ?
    `;
    
    // Execute the query
    const packages = await query(sql, [id]);
    
    if (packages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    const packageData = packages[0];

    // Get hotels for this destination
    const hotelsSql = `
      SELECT 
        h.id AS HotelID,
        h.name AS HotelName,
        h.description AS Description,
        h.address AS Address,
        h.price_per_night AS PricePerNight,
        h.star_rating AS StarRating,
        h.amenities AS Amenities,
        h.image_url AS ImageURL,
        h.latitude AS Latitude,
        h.longitude AS Longitude
      FROM 
        Hotel h
      WHERE 
        h.destination_id = ?
      ORDER BY 
        h.star_rating DESC, h.price_per_night ASC
    `;
    
    const hotels = await query(hotelsSql, [packageData.DestinationID]);

    // Parse amenities JSON
    const hotelsWithParsedAmenities = hotels.map(hotel => ({
      ...hotel,
      Amenities: hotel.Amenities ? JSON.parse(hotel.Amenities) : {}
    }));

    return NextResponse.json({
      success: true,
      package: packageData,
      hotels: hotelsWithParsedAmenities
    });

  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
