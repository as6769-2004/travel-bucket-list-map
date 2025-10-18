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

export default function App() {
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("packages");

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
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    fetchPackages();
    fetchHotels();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserBookings(currentUser.UserID);
    }
  }, [currentUser]);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      const data = await response.json();
      if (data.success) {
        setPackages(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/hotels");
      const data = await response.json();
      if (data.success) {
        setHotels(data.data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const response = await fetch(`/api/bookings/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleBookingStart = (pkg) => {
    setSelectedPackage(pkg);
    setBookingForm({ ...bookingForm, packageId: pkg.PackageID });
    setBookingStep(1);
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
          UserID: data.data.UserID,
          Name: bookingForm.name,
          Email: bookingForm.email,
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

    try {
      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.UserID,
          packageId: bookingForm.packageId,
          hotelId: bookingForm.hotelId,
          totalAmount: selectedPackage.Price,
        }),
      });
      const bookingData = await bookingResponse.json();

      if (bookingData.success) {
        // Create payment
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: bookingData.data.BookingID,
            mode: bookingForm.paymentMode,
            amount: selectedPackage.Price,
          }),
        });
        const paymentData = await paymentResponse.json();

        if (paymentData.success) {
          alert("Booking confirmed successfully!");
          setBookingDialogOpen(false);
          fetchUserBookings(currentUser.UserID);
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

  if (loading) {
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
                  Travel Bucket List
                </h1>

                <p className="text-xs text-gray-500">
                  Your Journey Starts Here
                </p>
              </div>
            </div>
            {currentUser && (
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.Name}
                </span>
              </div>
            )}
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
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger
              value="packages"
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>Packages</span>
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
                  key={pkg.PackageID}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-white opacity-50" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="line-clamp-1">{pkg.Title}</span>
                      <Badge variant="secondary">{pkg.Duration} days</Badge>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pkg.Description || "Explore amazing destinations"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pkg.destinations && pkg.destinations.length > 0 && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            Destinations:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pkg.destinations.slice(0, 3).map((dest) => (
                              <Badge
                                key={dest.DestinationID}
                                variant="outline"
                                className="text-xs"
                              >
                                {dest.City}
                              </Badge>
                            ))}
                            {pkg.destinations.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{pkg.destinations.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {pkg.transports && pkg.transports.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Bus className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {pkg.transports.map((t) => t.Type).join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(pkg.StartDate)} - {formatDate(pkg.EndDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          ${pkg.Price}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleBookingStart(pkg)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Book Now
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
            {!currentUser ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Please make a booking to view your trips
                  </p>
                  <Button
                    onClick={() => setActiveTab("packages")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Packages
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Bookings
                </h2>
                {bookings.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        You haven't made any bookings yet
                      </p>
                      <Button
                        onClick={() => setActiveTab("packages")}
                        className="bg-blue-600 hover:bg-blue-700"
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
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{booking.PackageTitle}</CardTitle>
                              <CardDescription>
                                Booking ID: {booking.BookingID}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                booking.Status === "Confirmed"
                                  ? "default"
                                  : booking.Status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {booking.Status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Hotel className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
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
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                Booked: {formatDate(booking.BookingDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold">
                                ${booking.TotalAmount}
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

            {analytics && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analytics.stats?.TotalBookings || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ${analytics.stats?.TotalRevenue || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Avg Booking Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        {Number(
                          analytics.stats?.AverageBookingValue ?? 0
                        ).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.stats?.TotalUsers || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Popular Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.popularPackages
                        ?.slice(0, 5)
                        .map((pkg, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                                ${pkg.TotalRevenue || 0}
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
                    <CardTitle>Top Destinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analytics.bookingsPerDestination
                        ?.slice(0, 6)
                        .map((dest, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
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
                    <CardTitle>Hotel Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.revenuePerHotel
                        ?.slice(0, 5)
                        .map((hotel, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                                  ${hotel.TotalRevenue || 0} revenue
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

          {bookingStep === 1 ? (
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
                      {selectedPackage?.Title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Duration: {selectedPackage?.Duration} days
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ${selectedPackage?.Price}
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
                    {hotels.map((hotel) => (
                      <SelectItem
                        key={hotel.HotelID}
                        value={hotel.HotelID.toString()}
                      >
                        {hotel.HotelName} - {hotel.City} ({hotel.Rating}★)
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
