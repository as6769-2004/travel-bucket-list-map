import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { bookingId, userId } = await request.json();

    if (!bookingId || !userId) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Verify booking belongs to user
    const booking = await query(
      'SELECT * FROM Booking WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    );

    if (booking.length === 0) {
      return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (booking[0].status === 'cancelled') {
      return Response.json({ success: false, error: 'Booking already cancelled' }, { status: 400 });
    }

    // Update booking status
    await query(
      'UPDATE Booking SET status = ?, updated_at = NOW() WHERE id = ?',
      ['cancelled', bookingId]
    );

    // Update payment status if exists
    await query(
      'UPDATE Payment SET status = ? WHERE booking_id = ?',
      ['refunded', bookingId]
    );

    return Response.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}