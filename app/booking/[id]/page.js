"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, CreditCard, Hotel, Plane, ArrowLeft, Edit, Save, X } from 'lucide-react';

export default function BookingDetails() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [hotels, setHotels] = useState([]);
  const [transport, setTransport] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    fetchBookingDetails();
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      const bookingRes = await fetch(`/api/bookings/${params.id}`);
      const bookingData = await bookingRes.json();
      
      if (bookingData.success && bookingData.booking) {
        setBooking(bookingData.booking);
        setEditData({...bookingData.booking});
        
        // Get destination_id from booking to fetch specific hotels and transport
        const destinationId = bookingData.booking.destination_id;
        console.log('Destination ID:', destinationId);
        
        const [hotelsRes, transportRes] = await Promise.all([
          fetch(`/api/hotels?destination_id=${destinationId}`),
          fetch(`/api/transport?destination_id=${destinationId}`)
        ]);
        
        const [hotelsData, transportData] = await Promise.all([
          hotelsRes.json(),
          transportRes.json()
        ]);
        
        if (hotelsData.success) {
          console.log('Hotels loaded:', hotelsData.hotels || hotelsData.data);
          let availableHotels = hotelsData.hotels || hotelsData.data || [];
          
          // Ensure current hotel is included if not in destination-specific list
          if (bookingData.booking.hotel_id && !availableHotels.find(h => h.id.toString() === bookingData.booking.hotel_id.toString())) {
            availableHotels.push({
              id: bookingData.booking.hotel_id,
              name: bookingData.booking.hotel_name,
              price_per_night: bookingData.booking.hotel_price
            });
          }
          
          setHotels(availableHotels);
        } else {
          console.error('Hotels fetch failed:', hotelsData);
          // Fallback: load all hotels
          const fallbackHotels = await fetch('/api/hotels');
          const fallbackHotelsData = await fallbackHotels.json();
          if (fallbackHotelsData.success) {
            setHotels(fallbackHotelsData.hotels || fallbackHotelsData.data || []);
          }
        }
        
        if (transportData.success) {
          console.log('Transport loaded:', transportData.transport || transportData.data);
          let availableTransport = transportData.transport || transportData.data || [];
          
          // Ensure current transport is included if not in destination-specific list
          if (bookingData.booking.transport_id && !availableTransport.find(t => t.id.toString() === bookingData.booking.transport_id.toString())) {
            availableTransport.push({
              id: bookingData.booking.transport_id,
              type: bookingData.booking.transport_type,
              provider: bookingData.booking.transport_provider,
              price: bookingData.booking.transport_price
            });
          }
          
          setTransport(availableTransport);
        } else {
          console.error('Transport fetch failed:', transportData);
          // Fallback: load all transport
          const fallbackTransport = await fetch('/api/transport');
          const fallbackTransportData = await fallbackTransport.json();
          if (fallbackTransportData.success) {
            setTransport(fallbackTransportData.transport || fallbackTransportData.data || []);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
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

  const calculateTotal = () => {
    const packagePrice = parseFloat(editData.package_price || booking.package_price || 0) * (editData.num_travelers || booking.num_travelers || 1);
    const hotelPrice = editData.hotel_id && editData.hotel_id !== 'none' ? parseFloat(hotels.find(h => h.id.toString() === editData.hotel_id.toString())?.price_per_night || 0) * (booking.duration || 5) * (editData.num_travelers || booking.num_travelers || 1) : 0;
    const transportPrice = editData.transport_id && editData.transport_id !== 'none' ? parseFloat(transport.find(t => t.id.toString() === editData.transport_id.toString())?.price || 0) * (editData.num_travelers || booking.num_travelers || 1) : 0;
    return packagePrice + hotelPrice + transportPrice;
  };

  const handleSave = async () => {
    const updatedData = { ...editData, total_price: calculateTotal() };
    
    // Update hotel and transport names based on selection
    if (updatedData.hotel_id && updatedData.hotel_id !== 'none') {
      const selectedHotel = hotels.find(h => h.id.toString() === updatedData.hotel_id.toString());
      updatedData.hotel_name = selectedHotel?.name;
      updatedData.hotel_price = selectedHotel?.price_per_night;
    } else {
      updatedData.hotel_name = null;
      updatedData.hotel_id = null;
      updatedData.hotel_price = 0;
    }
    
    if (updatedData.transport_id && updatedData.transport_id !== 'none') {
      const selectedTransport = transport.find(t => t.id.toString() === updatedData.transport_id.toString());
      updatedData.transport_provider = selectedTransport?.provider;
      updatedData.transport_type = selectedTransport?.type;
      updatedData.transport_price = selectedTransport?.price;
    } else {
      updatedData.transport_provider = null;
      updatedData.transport_type = null;
      updatedData.transport_id = null;
      updatedData.transport_price = 0;
    }
    
    try {
      const response = await fetch(`/api/bookings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        console.log('Database updated successfully');
        // Refresh data from database to ensure consistency
        fetchBookingDetails();
        return;
      }
    } catch (error) {
      console.error('Error updating database:', error);
    }
    
    setBooking(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({...booking});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Booking Not Found</h2>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600">Booking ID: #{booking.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Package Information</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(isEditing ? editData.status : booking.status)}>
                      {isEditing ? editData.status : booking.status}
                    </Badge>
                    {!isEditing ? (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.package_name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.destination_name}, {booking.country}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Travel Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{new Date(booking.travel_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Return Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{new Date(booking.return_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Travelers</Label>
                    {isEditing ? (
                      <Select value={editData.num_travelers.toString()} onValueChange={(value) => setEditData({...editData, num_travelers: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{booking.num_travelers} {booking.num_travelers === 1 ? 'person' : 'people'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Status</Label>
                    {isEditing ? (
                      <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="font-medium capitalize">{booking.status}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotel & Transport */}
            <Card>
              <CardHeader>
                <CardTitle>Accommodation & Transport</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Hotel</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Select value={editData.hotel_id?.toString() || 'none'} onValueChange={(value) => setEditData({...editData, hotel_id: value !== 'none' ? parseInt(value) : null, hotel_name: value !== 'none' ? hotels.find(h => h.id.toString() === value)?.name || null : null})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Hotel</SelectItem>
                        {hotels && hotels.map(hotel => (
                          <SelectItem key={hotel.id} value={hotel.id.toString()}>
                            {hotel.name} - ₹{hotel.price_per_night}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500 mt-2">
                      <p className="font-medium mb-1">Available Hotels:</p>
                      {hotels && hotels.map(hotel => (
                        <div key={hotel.id} className="flex justify-between py-1">
                          <span>{hotel.name}</span>
                          <span>₹{hotel.price_per_night}/night</span>
                        </div>
                      ))}
                    </div>
                    </div>
                  ) : (
                    booking.hotel_name && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Hotel className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{booking.hotel_name}</h4>
                          <div className="text-sm text-gray-600">
                            <p>₹{booking.hotel_price}/night</p>
                            <p>Total: ₹{(parseFloat(booking.hotel_price || 0) * (booking.duration || 5) * booking.num_travelers).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                <div>
                  <Label className="text-sm text-gray-600">Transport</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Select value={editData.transport_id?.toString() || 'none'} onValueChange={(value) => setEditData({...editData, transport_id: value !== 'none' ? parseInt(value) : null, transport_provider: value !== 'none' ? transport.find(t => t.id.toString() === value)?.provider || null : null, transport_type: value !== 'none' ? transport.find(t => t.id.toString() === value)?.type || null : null})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Transport</SelectItem>
                          {transport && transport.map(t => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              {t.type} - {t.provider} - ₹{t.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500 mt-2">
                        <p className="font-medium mb-1">Available Transport:</p>
                        {transport && transport.map(t => (
                          <div key={t.id} className="flex justify-between py-1">
                            <span>{t.type} - {t.provider}</span>
                            <span>₹{t.price}/person</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    booking.transport_provider && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Plane className="h-5 w-5 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{booking.transport_type} - {booking.transport_provider}</h4>
                          <div className="text-sm text-gray-600">
                            <p>₹{booking.transport_price}/person</p>
                            <p>Total: ₹{(parseFloat(booking.transport_price || 0) * booking.num_travelers).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editData.special_requests || ''}
                    onChange={(e) => setEditData({...editData, special_requests: e.target.value})}
                    placeholder="Enter special requests..."
                  />
                ) : (
                  <p className="text-gray-700">{booking.special_requests || 'No special requests'}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Package Cost</span>
                    <span>₹{(parseFloat((isEditing ? editData.package_price : booking.package_price) || 0) * ((isEditing ? editData.num_travelers : booking.num_travelers) || 1)).toLocaleString()}</span>
                  </div>
                  {((isEditing ? editData.hotel_id : booking.hotel_id) && (isEditing ? editData.hotel_id : booking.hotel_id) !== 'none') && (
                    <div className="flex justify-between text-sm">
                      <span>Hotel Cost ({(isEditing ? editData.duration : booking.duration)} nights)</span>
                      <span>₹{isEditing ? 
                        (parseFloat(hotels.find(h => h.id.toString() === editData.hotel_id.toString())?.price_per_night || 0) * (editData.duration || booking.duration || 1) * (editData.num_travelers || booking.num_travelers || 1)).toLocaleString() :
                        (parseFloat(booking.hotel_price || 0) * (booking.duration || 1) * booking.num_travelers).toLocaleString()
                      }</span>
                    </div>
                  )}
                  {((isEditing ? editData.transport_id : booking.transport_id) && (isEditing ? editData.transport_id : booking.transport_id) !== 'none') && (
                    <div className="flex justify-between text-sm">
                      <span>Transport Cost</span>
                      <span>₹{isEditing ? 
                        (parseFloat(transport.find(t => t.id.toString() === editData.transport_id.toString())?.price || 0) * (editData.num_travelers || booking.num_travelers || 1)).toLocaleString() :
                        (parseFloat(booking.transport_price || 0) * booking.num_travelers).toLocaleString()
                      }</span>
                    </div>
                  )}
                  <div className="border-t pt-2" />
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <div className="text-right">
                      <span className="font-semibold text-lg">₹{isEditing ? calculateTotal().toLocaleString() : parseFloat(booking.total_price).toLocaleString()}</span>
                      {isEditing && calculateTotal() !== parseFloat(booking.total_price) && (
                        <div className="text-xs">
                          <span className="text-red-500">Was: ₹{parseFloat(booking.total_price).toLocaleString()}</span>
                          <br/>
                          <span className={calculateTotal() > parseFloat(booking.total_price) ? 'text-red-600' : 'text-green-600'}>
                            {calculateTotal() > parseFloat(booking.total_price) ? '+' : ''}₹{(calculateTotal() - parseFloat(booking.total_price)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Method</span>
                    <span className="capitalize">{isEditing ? editData.payment_method : booking.payment_method}</span>
                  </div>
                  {booking.transaction_id && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Transaction ID</span>
                      <span>{booking.transaction_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Booking Date</span>
                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Payment Confirmed</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Download Invoice
                    </Button>
                    <Button className="w-full" variant="outline">
                      Contact Support
                    </Button>
                    {isEditing && calculateTotal() !== parseFloat(booking.total_price) && (
                      <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => {
                        const oldPrice = parseFloat(booking.total_price);
                        const newPrice = calculateTotal();
                        const difference = newPrice - oldPrice;
                        
                        let message;
                        if (difference > 0) {
                          message = `Additional payment of ₹${difference.toLocaleString()} required. Continue?`;
                        } else {
                          message = `₹${Math.abs(difference).toLocaleString()} will be added to your wallet. Continue?`;
                        }
                        
                        if (confirm(message)) {
                          // Mock payment confirmation
                          setTimeout(() => {
                            const updatedBooking = { ...editData, total_price: calculateTotal() };
                            setBooking(updatedBooking);
                            setIsEditing(false);
                            
                            if (difference > 0) {
                              alert(`Payment confirmed! Additional ₹${difference.toLocaleString()} charged. Booking updated.`);
                            } else {
                              alert(`Booking updated! ₹${Math.abs(difference).toLocaleString()} added to your wallet.`);
                            }
                          }, 2000);
                        }
                      }}>
                        {calculateTotal() > parseFloat(booking.total_price) ? 
                          `Pay Additional ₹${(calculateTotal() - parseFloat(booking.total_price)).toLocaleString()}` :
                          `Confirm Changes (₹${Math.abs(calculateTotal() - parseFloat(booking.total_price)).toLocaleString()} to wallet)`
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}