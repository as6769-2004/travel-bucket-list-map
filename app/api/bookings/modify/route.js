import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { bookingId, userId, travelDate, returnDate, numTravelers, specialRequests } = await request.json();

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

    if (booking[0].status === 'cancelled' || booking[0].status === 'completed') {
      return Response.json({ success: false, error: 'Cannot modify this booking' }, { status: 400 });
    }

    // Get package and hotel prices for recalculation
    const bookingDetails = await query(
      `SELECT b.*, tp.price as package_price, h.price_per_night as hotel_price 
       FROM Booking b 
       JOIN TripPackage tp ON b.package_id = tp.id 
       LEFT JOIN Hotel h ON b.hotel_id = h.id 
       WHERE b.id = ?`,
      [bookingId]
    );

    const currentBooking = bookingDetails[0];
    const newTravelDate = travelDate || currentBooking.travel_date;
    const newReturnDate = returnDate || currentBooking.return_date;
    const newNumTravelers = numTravelers || currentBooking.num_travelers;

    // Calculate new duration and total price
    const duration = Math.ceil((new Date(newReturnDate) - new Date(newTravelDate)) / (1000 * 60 * 60 * 24));
    const packageCost = currentBooking.package_price * newNumTravelers;
    const hotelCost = currentBooking.hotel_price ? currentBooking.hotel_price * duration * newNumTravelers : 0;
    const newTotalPrice = packageCost + hotelCost;

    // Build update query
    let updateFields = ['total_price = ?'];
    let updateValues = [newTotalPrice];

    if (travelDate) {
      updateFields.push('travel_date = ?');
      updateValues.push(travelDate);
    }
    if (returnDate) {
      updateFields.push('return_date = ?');
      updateValues.push(returnDate);
    }
    if (numTravelers) {
      updateFields.push('num_travelers = ?');
      updateValues.push(numTravelers);
    }
    if (specialRequests !== undefined) {
      updateFields.push('special_requests = ?');
      updateValues.push(specialRequests);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(bookingId);

    await query(
      `UPDATE Booking SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Update payment amount if exists
    await query(
      'UPDATE Payment SET amount = ? WHERE booking_id = ?',
      [newTotalPrice, bookingId]
    );

    return Response.json({ 
      success: true, 
      message: 'Booking modified successfully',
      newTotalPrice 
    });
  } catch (error) {
    console.error('Modify booking error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}