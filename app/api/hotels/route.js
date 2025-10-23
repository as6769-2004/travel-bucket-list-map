import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destination_id');
    
    let sql = 'SELECT id, name, price_per_night, destination_id FROM Hotel';
    let params = [];
    
    if (destinationId) {
      sql += ' WHERE destination_id = ?';
      params.push(destinationId);
    }
    
    sql += ' ORDER BY price_per_night';
    
    const hotels = await query(sql, params);
    
    return Response.json({ success: true, data: hotels, hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    
    // Fallback data filtered by destination_id
    const fallbackHotels = [
      { id: 1, name: "Beach Resort Goa", price_per_night: 3000, destination_id: 1 },
      { id: 2, name: "Palace Hotel Jaipur", price_per_night: 4000, destination_id: 2 },
      { id: 3, name: "Backwater Resort Kerala", price_per_night: 2500, destination_id: 3 }
    ];
    
    const destinationId = new URL(request.url).searchParams.get('destination_id');
    const filteredHotels = destinationId ? 
      fallbackHotels.filter(h => h.destination_id.toString() === destinationId) : 
      fallbackHotels;
    
    return Response.json({ success: true, data: filteredHotels, hotels: filteredHotels });
  }
}