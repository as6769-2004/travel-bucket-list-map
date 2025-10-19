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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  MapPin,
  Star,
  Users,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Package,
  Heart,
  Share2,
  Clock,
  Plane,
  Hotel,
} from "lucide-react";


export default function PackagesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
    
    const handleLoginChange = () => checkAuth();
    window.addEventListener('loginStatusChanged', handleLoginChange);
    
    return () => window.removeEventListener('loginStatusChanged', handleLoginChange);
  }, []);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [filters, setFilters] = useState({
    destination: "all",
    priceRange: "all",
    duration: "all",
    sortBy: "id",
    sortOrder: "DESC"
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, filters]);

  const fetchPackages = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filters.destination !== 'all') queryParams.append('destination', filters.destination);
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-');
        if (min) queryParams.append('priceMin', min);
        if (max) queryParams.append('priceMax', max);
      }
      if (filters.duration !== 'all') queryParams.append('duration', filters.duration);
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/packages?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.packages && Array.isArray(data.packages)) {
        setPackages(data.packages);
        setError(null);
      } else {
        setPackages([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError("Failed to load travel packages. Please try again later.");
      setLoading(false);
      setPackages([]);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.name?.toLowerCase().includes(term) ||
        pkg.description?.toLowerCase().includes(term) ||
        pkg.destinations?.some(dest => dest.name?.toLowerCase().includes(term))
      );
    }
    
    setFilteredPackages(filtered);
  };

  const getUniqueDestinations = () => {
    const destinations = [];
    packages.forEach(pkg => {
      if (pkg.destinations) {
        pkg.destinations.forEach(dest => {
          if (dest.name && !destinations.includes(dest.name)) {
            destinations.push(dest.name);
          }
        });
      }
    });
    return destinations.sort();
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString()}`;
  };

  const getPackageImage = (pkg) => {
    return pkg.destinations?.[0]?.image_url || 'https://picsum.photos/400/300?random=99';
  };

  const handleBookNow = (pkg) => {
    const user = localStorage.getItem('user');
    console.log('Auth check:', { isAuthenticated, user: !!user });
    
    if (!user) {
      alert('Please login to book a package');
      window.location.href = '/login';
      return;
    }
    window.location.href = `/booking/new?package=${pkg.id}`;
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      fetchPackages();
    }, 300);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setLoading(true);
    setTimeout(() => fetchPackages(), 300);
  };

  const PackageSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="h-48 w-full bg-gray-200 animate-pulse" />
      <CardHeader>
        <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Travel Packages
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover amazing travel packages and book your next adventure
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search & Filter Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filters.destination} onValueChange={(value) => handleFilterChange('destination', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {getUniqueDestinations().map((dest) => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-25000">Under ₹25,000</SelectItem>
                    <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="100000-">Above ₹1,00,000</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.duration} onValueChange={(value) => handleFilterChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10+ Days</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packages Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Packages ({filteredPackages.length})
            </h2>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Latest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <PackageSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getPackageImage(pkg)}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/400/300?random=99';
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {pkg.rating && (
                      <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{pkg.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1">{pkg.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pkg.description || 'Explore amazing destinations and create unforgettable memories'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {pkg.destinations && pkg.destinations.length > 0 
                          ? pkg.destinations.map(d => d.name).join(', ')
                          : 'Multiple Destinations'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration} days</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{pkg.reviewCount || 0} reviews</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(parseFloat(pkg.price))}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">per person</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          window.location.href = '/auth/login';
                        } else {
                          window.location.href = `/booking/new?packageId=${pkg.id}`;
                        }
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isAuthenticated ? 'Book Now' : 'Login to Book'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No packages found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilters({
                  destination: 'all',
                  priceRange: 'all',
                  duration: 'all',
                  sortBy: 'id',
                  sortOrder: 'DESC'
                });
                fetchPackages();
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Package: {selectedPackage?.Title}</DialogTitle>
            <DialogDescription>
              Complete your booking for this amazing travel package
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPackage && (
              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedPackage.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.duration} days</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(parseFloat(selectedPackage.price))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Booking functionality will be implemented in the next phase
              </p>
              <Button 
                onClick={() => setShowBookingDialog(false)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}