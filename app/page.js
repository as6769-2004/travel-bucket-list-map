"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Calendar,
  DollarSign,
  Hotel,
  Bus,
  Star,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import InteractiveMap from "@/components/map/InteractiveMap";
import DestinationImage from "@/components/ui/destination-image";

export default function App() {
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("packages");
  const [mounted, setMounted] = useState(false);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    packageId: null,
    hotelId: null,
    paymentMode: "UPI",
  });

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [mapSelectedPackage, setMapSelectedPackage] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    fetchPackages();
    fetchHotels();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserBookings(currentUser.id || currentUser.UserID);
    }
  }, [currentUser]);

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
      setPackages([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/hotels");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHotels(
        data.success
          ? (data.hotels || data.data)
          : [
              {
                id: 1,
                name: "Beach Resort Goa",
                address: "Calangute Beach, Goa",
                star_rating: 5,
              },
              {
                id: 2,
                name: "Palace Hotel Jaipur",
                address: "City Palace Road, Jaipur",
                star_rating: 4,
              },
            ]
      );
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setHotels([
        {
          id: 1,
          name: "Beach Resort Goa",
          address: "Calangute Beach, Goa",
          star_rating: 5,
        },
        {
          id: 2,
          name: "Palace Hotel Jaipur",
          address: "City Palace Road, Jaipur",
          star_rating: 4,
        },
      ]);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const response = await fetch(`/api/bookings/user?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data.success ? data.bookings : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalytics(data.success ? data.data : null);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(null);
    }
  };

  const handleBookingStart = async (pkg) => {
    if (!isLoggedIn) {
      alert("Please login to book a package");
      window.location.href = "/login";
      return;
    }
    setSelectedPackage(pkg);
    setBookingForm({ ...bookingForm, packageId: pkg.id });
    
    // Clear previous hotels
    setHotels([]);
    
    // Fetch destination-specific hotels
    const destinationId = pkg.destination_id || pkg.destinations?.[0]?.id;
    console.log('Package:', pkg.name, 'Destination ID:', destinationId);
    
    if (destinationId) {
      try {
        const hotelsRes = await fetch(`/api/hotels?destination_id=${destinationId}`);
        const hotelsData = await hotelsRes.json();
        
        console.log('Hotels API response:', hotelsData);
        
        if (hotelsData.success && hotelsData.hotels) {
          setHotels(hotelsData.hotels);
          console.log('Hotels set:', hotelsData.hotels);
        } else {
          console.log('No hotels found for destination:', destinationId);
          setHotels([]);
        }
      } catch (error) {
        console.error('Error fetching destination data:', error);
        setHotels([]);
      }
    }
    
    setBookingStep(isLoggedIn ? 2 : 1);
    setBookingDialogOpen(true);
  };

  const handleUserSubmit = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          street: bookingForm.street,
          city: bookingForm.city,
          state: bookingForm.state,
          pincode: bookingForm.pincode,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser({
          id: data.data.id,
          UserID: data.data.id,
          name: bookingForm.name,
          Name: bookingForm.name,
          email: bookingForm.email,
        });
        setBookingStep(2);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.hotelId) {
      alert("Please select a hotel");
      return;
    }

    if (!currentUser || !currentUser.UserID) {
      alert("Please login to complete booking");
      return;
    }

    try {
      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || currentUser.UserID,
          packageId: bookingForm.packageId,
          hotelId: bookingForm.hotelId,
          totalAmount: parseFloat(selectedPackage.price),
        }),
      });
      const bookingData = await bookingResponse.json();

      if (bookingData.success) {
        // Create payment
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: bookingData.data.id || bookingData.data.BookingID,
            mode: bookingForm.paymentMode,
            amount: parseFloat(selectedPackage.price),
          }),
        });
        const paymentData = await paymentResponse.json();

        if (paymentData.success) {
          alert("Booking confirmed successfully!");
          setBookingDialogOpen(false);
          fetchUserBookings(currentUser.id || currentUser.UserID);
          setActiveTab("bookings");
          // Reset form
          setBookingForm({
            name: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            packageId: null,
            hotelId: null,
            paymentMode: "UPI",
          });
        }
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading travel experiences...</p>
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travel Bucket List Map
                </h1>

                <p className="text-xs text-gray-500">
                  Your Journey Starts Here
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isLoggedIn && currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.name ||
                        currentUser.Name ||
                        currentUser.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem("user");
                      setCurrentUser(null);
                      setIsLoggedIn(false);
                      setBookings([]);
                      setActiveTab("packages");
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => (window.location.href = "/packages")}
                  >
                    Browse Packages
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger
              value="packages"
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>Packages</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Map</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>My Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Explore Destinations on Map
              </h2>
              <p className="text-gray-600">
                Click on markers to view package details and book your adventure
              </p>
            </div>

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
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border h-full">
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
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-800">
                          ⭐ {selectedPackage.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {selectedPackage.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedPackage.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-green-600">
                            ₹{parseFloat(selectedPackage.price).toLocaleString()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedPackage.duration} days
                          </span>
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
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
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
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Explore Amazing Destinations
              </h2>
              <p className="text-gray-600">
                Discover your next adventure with our curated travel packages
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    <img
                      src={
                        pkg.image ||
                        `https://images.unsplash.com/photo-${
                          pkg.id === 1
                            ? "1512343879784-a960bf40e7f2"
                            : pkg.id === 2
                            ? "1599661046827-dacde6976549"
                            : pkg.id === 3
                            ? "1506905925346-21bda4d32df4"
                            : pkg.id === 4
                            ? "1602216056096-3b40cc0c9944"
                            : pkg.id === 5
                            ? "1564507592333-c60657eea523"
                            : "1512453979798-5ea266f8880c"
                        }?w=400&h=300&fit=crop`
                      }
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(
                          pkg.name.split(" ")[0]
                        )}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-800">
                      ⭐ {pkg.rating || "4.5"}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="line-clamp-1">{pkg.name}</span>
                      <Badge variant="secondary">{pkg.duration} days</Badge>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pkg.description || "Explore amazing destinations"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          Destinations:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pkg.destinations && pkg.destinations.length > 0 ? (
                            pkg.destinations.map((dest) => (
                              <Badge
                                key={dest.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {dest.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Multiple Destinations
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        Rating: {pkg.rating || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {pkg.duration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{parseFloat(pkg.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        if (!isLoggedIn) {
                          window.location.href = '/login';
                        } else {
                          window.location.href = `/booking/new?packageId=${pkg.id}`;
                        }
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoggedIn ? "Book Now" : "Login to Book"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No packages available at the moment
                </p>
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {!isLoggedIn ? (
              <Card className="text-center py-12 bg-gray-50 rounded-lg">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Login Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please login to view your bookings and manage your trips
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      onClick={() => (window.location.href = "/login")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("packages")}
                    >
                      Browse Packages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Bookings
                </h2>
                {bookings.length === 0 ? (
                  <Card className="text-center py-12 bg-gray-50 rounded-lg">
                    <CardContent>
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        You haven't made any bookings yet. Browse our packages
                        and start your adventure!
                      </p>
                      <Button
                        onClick={() => setActiveTab("packages")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Browse Packages
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                      <Card
                        key={booking.BookingID}
                        className="border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="flex items-center">
                                <span>{booking.PackageTitle}</span>
                                <Badge
                                  className="ml-3"
                                  variant={
                                    booking.Status === "Confirmed"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {booking.Status}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                Booking ID: {booking.BookingID}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                ₹{booking.TotalAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Hotel className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {booking.HotelName}, {booking.HotelCity}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">
                                Rating: {booking.HotelRating}/5
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">
                                Booked: {formatDate(booking.BookingDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold">
                                ₹{booking.TotalAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {booking.payments && booking.payments.length > 0 && (
                            <div className="col-span-full mt-2 pt-2 border-t">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Payment Details:
                              </p>
                              {booking.payments.map((payment) => (
                                <div
                                  key={payment.PaymentID}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {payment.Mode}
                                  </span>
                                  <Badge
                                    variant={
                                      payment.Status === "Success"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {payment.Status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="col-span-full mt-4 pt-2 border-t">
                            <Button
                              onClick={() => window.location.href = `/booking/${booking.BookingID}`}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Travel Analytics
            </h2>

            {analytics ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Total Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.stats?.TotalBookings || 0}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        All time bookings
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(analytics.stats?.TotalRevenue || 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        All time revenue
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                        Avg Booking Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        ₹
                        {Number(
                          analytics.stats?.AverageBookingValue ?? 0
                        ).toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Per booking</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-500" />
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {analytics.stats?.TotalUsers || 0}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Registered users
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Popular Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                      Most Popular Packages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.popularPackages
                        ?.slice(0, 5)
                        .map((pkg, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {pkg.Title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {pkg.TotalBookings || 0} bookings
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                ₹{(pkg.TotalRevenue || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">revenue</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Destinations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                      Top Destinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analytics.bookingsPerDestination
                        ?.slice(0, 6)
                        .map((dest, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
                          >
                            <div className="bg-blue-600 p-2 rounded-lg">
                              <MapPin className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {dest.Destination}
                              </p>
                              <p className="text-sm text-gray-600">
                                {dest.City}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {dest.TotalBookings}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hotel Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Hotel className="h-5 w-5 mr-2 text-green-600" />
                      Hotel Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.revenuePerHotel
                        ?.slice(0, 5)
                        .map((hotel, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {hotel.HotelName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {hotel.City}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {hotel.TotalBookings || 0} bookings
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{(hotel.TotalRevenue || 0).toLocaleString()}{" "}
                                  revenue
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">
                                  {!isNaN(Number(hotel.AverageRating))
                                    ? Number(hotel.AverageRating).toFixed(1)
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-xl font-medium">
                  Analytics data not available
                </h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Please check back later for analytics information or contact
                  support if this persists.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 ? "Your Details" : "Complete Booking"}
            </DialogTitle>
            <DialogDescription>
              {bookingStep === 1
                ? "Please provide your contact information"
                : `Complete your booking for ${selectedPackage?.Title}`}
            </DialogDescription>
          </DialogHeader>

          {bookingStep === 1 && !isLoggedIn ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={bookingForm.name}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={bookingForm.street}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, street: e.target.value })
                  }
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={bookingForm.city}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, city: e.target.value })
                    }
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={bookingForm.state}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, state: e.target.value })
                    }
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={bookingForm.pincode}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      {selectedPackage?.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Duration: {selectedPackage?.duration} days
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ₹
                        {parseFloat(
                          selectedPackage?.price || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="hotel">Select Hotel *</Label>
                <Select
                  value={bookingForm.hotelId}
                  onValueChange={(value) =>
                    setBookingForm({ ...bookingForm, hotelId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels && hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name} - {hotel.address} ({hotel.star_rating}★)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Method *</Label>
                <Select
                  value={bookingForm.paymentMode}
                  onValueChange={(value) =>
                    setBookingForm({ ...bookingForm, paymentMode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="NetBanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            {bookingStep === 1 ? (
              <Button
                onClick={handleUserSubmit}
                disabled={!bookingForm.name || !bookingForm.email}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            ) : (
              <div className="flex space-x-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setBookingStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleBookingSubmit}
                  disabled={!bookingForm.hotelId}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
