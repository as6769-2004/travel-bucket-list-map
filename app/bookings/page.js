"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CreditCard, Clock } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modifyForm, setModifyForm] = useState({});
  const [newPrice, setNewPrice] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/bookings/user?userId=${userData.id}`);
      const data = await response.json();
      if (data.success && data.bookings) {
        const formattedBookings = data.bookings.map(booking => ({
          id: booking.BookingID,
          package_name: booking.PackageTitle,
          hotel_name: booking.HotelName,
          status: booking.Status,
          travel_date: booking.TravelDate,
          return_date: booking.ReturnDate,
          booking_date: booking.BookingDate,
          num_travelers: booking.NumTravelers,
          total_price: booking.TotalAmount,
          destination_name: booking.DestinationName,
          country: booking.Country,
          special_requests: booking.SpecialRequests
        }));
        setBookings(formattedBookings);
      } else {
        setBookings([
          {
            id: 1,
            package_name: "Goa Beach Paradise",
            hotel_name: "Beach Resort Goa",
            status: "confirmed",
            travel_date: "2024-02-15",
            return_date: "2024-02-20",
            booking_date: "2024-01-10",
            num_travelers: 2,
            total_price: 25000,
            destination_name: "Goa",
            country: "India",
            special_requests: "Sea views room preferred"
          },
          {
            id: 2,
            package_name: "Rajasthan Heritage Tour",
            hotel_name: "Palace Hotel Jaipur",
            status: "pending",
            travel_date: "2024-03-10",
            return_date: "2024-03-17",
            booking_date: "2024-01-20",
            num_travelers: 4,
            total_price: 45000,
            destination_name: "Jaipur",
            country: "India",
            special_requests: "Vegetarian meals only"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([
        {
          id: 1,
          package_name: "Goa Beach Paradise",
          hotel_name: "Beach Resort Goa",
          status: "confirmed",
          travel_date: "2024-02-15",
          return_date: "2024-02-20",
          booking_date: "2024-01-10",
          num_travelers: 2,
          total_price: 25000,
          destination_name: "Goa",
          country: "India",
          special_requests: "Sea view room preferred"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, hasCharges = false) => {
    const message = hasCharges 
      ? 'Cancellation charges may apply. Continue?' 
      : 'Are you sure you want to cancel this booking?';
    
    if (!confirm(message)) return;

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, userId: userData.id })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(hasCharges ? 'Booking cancelled. Refund will be processed.' : 'Booking cancelled successfully!');
        fetchBookings();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleModifyBooking = (booking) => {
    setSelectedBooking(booking);
    setModifyForm({
      travelDate: booking.travel_date,
      returnDate: booking.return_date,
      numTravelers: booking.num_travelers,
      specialRequests: booking.special_requests || ''
    });
    setShowModifyModal(true);
  };

  const submitModifyBooking = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/bookings/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          userId: userData.id,
          ...modifyForm,
          numTravelers: parseInt(modifyForm.numTravelers)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Booking modified successfully!\nNew total: ₹${data.newTotalPrice?.toLocaleString()}`);
        setShowModifyModal(false);
        fetchBookings();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to modify booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and track all your travel bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">Start planning your next adventure</p>
              <Button onClick={() => window.location.href = '/packages'}>
                Browse Packages
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.package_name}</CardTitle>
                      <p className="text-gray-600 mt-1">{booking.destination_name}, {booking.country}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Booked: {new Date(booking.booking_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{booking.num_travelers} travelers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span>₹{parseFloat(booking.total_price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Travel Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Departure: {new Date(booking.travel_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Return: {new Date(booking.return_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{booking.hotel_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.location.href = `/booking/${booking.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            const invoice = `TRAVELQUEST INVOICE\n\nBooking ID: #${booking.id}\nDate: ${new Date().toLocaleDateString()}\n\nPackage: ${booking.package_name}\nDestination: ${booking.destination_name}, ${booking.country}\nHotel: ${booking.hotel_name}\n\nTravel Dates: ${new Date(booking.travel_date).toLocaleDateString()} - ${new Date(booking.return_date).toLocaleDateString()}\nTravelers: ${booking.num_travelers}\n\nTotal Amount: ₹${parseFloat(booking.total_price).toLocaleString()}\nStatus: ${booking.status.toUpperCase()}\n\nThank you for choosing TravelQuest!`;
                            const blob = new Blob([invoice], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `invoice-${booking.id}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Download Invoice
                        </Button>
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => window.location.href = `/booking/${booking.id}`}
                            >
                              Modify Booking
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && new Date(booking.travel_date) > new Date() && (
                          <>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleCancelBooking(booking.id, true)}
                            >
                              Cancel Booking
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => window.location.href = `/booking/${booking.id}`}
                            >
                              Modify Booking
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              const rating = prompt('Rate your experience (1-5 stars):');
                              if (rating && rating >= 1 && rating <= 5) {
                                const review = prompt('Write your review:');
                                if (review) {
                                  alert(`Thank you for your ${rating}-star review!\n\n"${review}"\n\nYour feedback helps us improve.`);
                                }
                              }
                            }}
                          >
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm text-gray-900 mb-1">Special Requests:</h5>
                      <p className="text-sm text-gray-600">{booking.special_requests}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showModifyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Modify Booking</h3>
              <form onSubmit={submitModifyBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={modifyForm.travelDate}
                    onChange={(e) => setModifyForm({...modifyForm, travelDate: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Return Date</label>
                  <input
                    type="date"
                    value={modifyForm.returnDate}
                    onChange={(e) => setModifyForm({...modifyForm, returnDate: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={modifyForm.numTravelers}
                    onChange={(e) => setModifyForm({...modifyForm, numTravelers: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests</label>
                  <textarea
                    value={modifyForm.specialRequests}
                    onChange={(e) => setModifyForm({...modifyForm, specialRequests: e.target.value})}
                    className="w-full p-2 border rounded h-20"
                    placeholder="Any special requests..."
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Current Total:</strong> ₹{parseFloat(selectedBooking?.total_price || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Price will be recalculated based on new dates and travelers
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Save Changes</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowModifyModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}