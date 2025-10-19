"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Star, Plane, Hotel, Utensils } from 'lucide-react';

export default function PackageDetails() {
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [packageData, setPackageData] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPackageDetails();
      fetchHotels();
    }
  }, [params.id]);

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`/api/packages/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setPackageData(data.data);
      }
    } catch (error) {
      console.error('Error fetching package:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch('/api/hotels');
      const data = await response.json();
      if (data.success) {
        setHotels(data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(`/packages/${params.id}`)}`;
      return;
    }
    window.location.href = `/booking/new?package=${params.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Package Not Found</h2>
            <Button onClick={() => window.location.href = '/packages'}>Browse Packages</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{packageData.name}</h1>
              <p className="text-xl opacity-90">{packageData.description}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-green-100 text-green-800">
                <Calendar className="h-4 w-4 mr-1" />
                {packageData.duration} days
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Star className="h-4 w-4 mr-1" />
                {packageData.rating || 'New'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <div className="space-y-2">
                  {packageData.includes_flight && (
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-600" />
                      <span>Flight included</span>
                    </div>
                  )}
                  {packageData.includes_hotel && (
                    <div className="flex items-center gap-2">
                      <Hotel className="h-5 w-5 text-green-600" />
                      <span>Hotel accommodation</span>
                    </div>
                  )}
                  {packageData.includes_meals && (
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-orange-600" />
                      <span>Meals included</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">₹{parseFloat(packageData.price).toLocaleString()}</span>
                  <span className="text-gray-600 ml-2">per person</span>
                </div>
                <Button onClick={handleBookNow} size="lg" className="w-full md:w-auto">
                  {isAuthenticated ? 'Book Now' : 'Login to Book'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{hotel.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.star_rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">₹{parseFloat(hotel.price_per_night).toLocaleString()}/night</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}