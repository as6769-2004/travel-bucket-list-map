import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destination_id');
    
    let sql = 'SELECT id, type, provider, price, destination_id FROM Transport';
    let params = [];
    
    if (destinationId) {
      sql += ' WHERE destination_id = ?';
      params.push(destinationId);
    }
    
    sql += ' ORDER BY type, price';
    
    const transport = await query(sql, params);
    
    return Response.json({ success: true, data: transport, transport });
  } catch (error) {
    console.error('Error fetching transport:', error);
    
    // Fallback data filtered by destination_id
    const fallbackTransport = [
      { id: 1, type: "flight", provider: "IndiGo", price: 5000, destination_id: 1 },
      { id: 2, type: "train", provider: "Indian Railways", price: 1500, destination_id: 2 },
      { id: 3, type: "bus", provider: "Kerala KSRTC", price: 800, destination_id: 3 }
    ];
    
    const destinationId = new URL(request.url).searchParams.get('destination_id');
    const filteredTransport = destinationId ? 
      fallbackTransport.filter(t => t.destination_id.toString() === destinationId) : 
      fallbackTransport;
    
    return Response.json({ success: true, data: filteredTransport, transport: filteredTransport });
  }
}