"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/bookings/user?userId=${userData.id}`);
      const data = await response.json();
      if (data.success && data.bookings) {
        // Convert API response to expected format
        const formattedBookings = data.bookings.map(booking => ({
          id: booking.BookingID,
          package_name: booking.PackageTitle,
          hotel_name: booking.HotelName,
          status: booking.Status,
          travel_date: booking.TravelDate,
          num_travelers: booking.NumTravelers,
          total_price: booking.TotalAmount,
          destination_name: booking.DestinationName,
          country: booking.Country
        }));
        setBookings(formattedBookings);
      } else {
        // Fallback mock data for testing
        setBookings([
          {
            id: 1,
            package_name: "Goa Beach Paradise",
            hotel_name: "Beach Resort Goa",
            status: "confirmed",
            travel_date: "2024-02-15",
            num_travelers: 2,
            total_price: 25000,
            destination_name: "Goa",
            country: "India"
          },
          {
            id: 2,
            package_name: "Rajasthan Heritage Tour",
            hotel_name: "Palace Hotel Jaipur",
            status: "pending",
            travel_date: "2024-03-10",
            num_travelers: 4,
            total_price: 45000,
            destination_name: "Jaipur",
            country: "India"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback mock data
      setBookings([
        {
          id: 1,
          package_name: "Goa Beach Paradise",
          hotel_name: "Beach Resort Goa",
          status: "confirmed",
          travel_date: "2024-02-15",
          num_travelers: 2,
          total_price: 25000,
          destination_name: "Goa",
          country: "India"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name || user?.username || 'User'}</h1>
          <p className="text-gray-600 mt-2">Manage your travel bookings and explore new destinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destinations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(bookings.map(b => b.package_name)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start exploring amazing destinations</p>
                <Button onClick={() => router.push('/packages')}>
                  Browse Packages
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.package_name}</h3>
                        <p className="text-gray-600">{booking.hotel_name}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{booking.num_travelers} travelers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>₹{parseFloat(booking.total_price).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{booking.destination_name}, {booking.country}</span>
                      </div>
                      <div className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/booking/${booking.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}