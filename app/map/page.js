"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft } from "lucide-react";
import InteractiveMap from "@/components/map/InteractiveMap";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setIsLoggedIn(true);
    }
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPackages(
        data.packages ||
          data.data || [
            {
              id: 1,
              destination_id: 1,
              name: "🏖️ Goa Beach Paradise",
              description:
                "Golden beaches, vibrant nightlife, Portuguese heritage. Beach parties, water sports, sunset cruises.",
              price: 15000,
              duration: 5,
              rating: 4.5,
              destinations: [{ id: 1, name: "Goa", country: "India" }],
              image:
                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
            },
            {
              id: 2,
              destination_id: 2,
              name: "🏰 Rajasthan Royal Heritage",
              description:
                "Majestic palaces, desert safaris, royal culture. Camel rides, folk dances, luxury stays.",
              price: 25000,
              duration: 7,
              rating: 4.8,
              destinations: [{ id: 2, name: "Jaipur", country: "India" }],
              image:
                "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=400",
            },
            {
              id: 3,
              destination_id: 3,
              name: "🌴 Kerala Backwaters",
              description:
                "Serene backwaters, spice plantations, Ayurveda. Houseboat stays, traditional cuisine, wellness.",
              price: 18000,
              duration: 5,
              rating: 4.6,
              destinations: [{ id: 3, name: "Kerala", country: "India" }],
              image:
                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
            },
            {
              id: 4,
              destination_id: 4,
              name: "🕌 Spiritual Varanasi",
              description:
                "Ancient rituals and spiritual essence of India's oldest living city.",
              price: 12000,
              duration: 3,
              rating: 4.9,
              destinations: [{ id: 4, name: "Varanasi", country: "India" }],
              image:
                "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            },
            {
              id: 5,
              destination_id: 5,
              name: "🕌 Agra Taj Mahal Wonder",
              description:
                "Iconic Taj Mahal, Mughal architecture, history. Monument tours, local crafts, cultural shows.",
              price: 12000,
              duration: 3,
              rating: 4.9,
              destinations: [{ id: 5, name: "Agra", country: "India" }],
              image:
                "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
            },
            {
              id: 6,
              destination_id: 10,
              name: "🏙️ Dubai Luxury Experience",
              description:
                "Futuristic skyline, luxury shopping, desert adventures. Burj Khalifa, gold souks, safari tours.",
              price: 45000,
              duration: 4,
              rating: 4.8,
              destinations: [{ id: 10, name: "Dubai", country: "UAE" }],
              image:
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
            },
          ]
      );
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Interactive Map
                </h1>
                <p className="text-sm text-gray-500">
                  Explore destinations and book your adventure
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Map Section */}
          <div className="h-full">
            <InteractiveMap
              packages={packages}
              onDestinationSelect={(pkg) => {
                setSelectedPackage(pkg);
              }}
              selectedDestination={selectedPackage}
            />
          </div>

          {/* Package Details Section */}
          <div className="h-full overflow-y-auto">
            {selectedPackage ? (
              <Card className="h-full">
                <div className="relative h-48">
                  <img
                    src={
                      selectedPackage.image ||
                      `https://images.unsplash.com/photo-${
                        selectedPackage.id === 1
                          ? "1512343879784-a960bf40e7f2"
                          : selectedPackage.id === 2
                          ? "1599661046827-dacde6976549"
                          : selectedPackage.id === 3
                          ? "1506905925346-21bda4d32df4"
                          : selectedPackage.id === 4
                          ? "1602216056096-3b40cc0c9944"
                          : selectedPackage.id === 5
                          ? "1564507592333-c60657eea523"
                          : "1512453979798-5ea266f8880c"
                      }?w=600&h=300&fit=crop`
                    }
                    alt={selectedPackage.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-800">
                      ⭐ {selectedPackage.rating || "4.5"}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedPackage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {selectedPackage.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{parseFloat(selectedPackage.price).toLocaleString()}
                      </span>
                      <Badge variant="secondary">
                        {selectedPackage.duration} days
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (!isLoggedIn) {
                          window.location.href = '/login';
                        } else {
                          window.location.href = `/booking/new?packageId=${selectedPackage.id}`;
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoggedIn ? "Book Now" : "Login to Book"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPackage(null)}
                      className="px-6"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a Destination
                  </h3>
                  <p className="text-gray-600">
                    Click on any marker on the map to view package details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}