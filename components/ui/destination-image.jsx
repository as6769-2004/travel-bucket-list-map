"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const destinationImages = {
  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  "Rajasthan": "https://images.unsplash.com/photo-1599661046827-dacde645ed05?w=400&h=300&fit=crop",
  "Himachal Pradesh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Kashmir": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  "Ladakh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Shimla": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Darjeeling": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
  "Ooty": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
  "Munnar": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  "Coorg": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  "Andaman": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  "Andaman Islands": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  "Leh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Spiti": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  "Rishikesh": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
  "Varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop",
  "Agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
  "Jaipur": "https://images.unsplash.com/photo-1599661046827-dacde645ed05?w=400&h=300&fit=crop",
  "Udaipur": "https://images.unsplash.com/photo-1599661046827-dacde645ed05?w=400&h=300&fit=crop",
  "Jodhpur": "https://images.unsplash.com/photo-1599661046827-dacde645ed05?w=400&h=300&fit=crop",
  "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop"
};

export default function DestinationImage({ destinations, className = "" }) {
  const [imageError, setImageError] = useState(false);
  
  // Get the first destination's image or use a default
  const firstDestination = destinations && destinations.length > 0 ? destinations[0].name || destinations[0].Name : null;
  const imageUrl = firstDestination ? destinationImages[firstDestination] : null;
  
  if (!imageUrl || imageError) {
    return (
      <div className={`bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${className}`}>
        <MapPin className="h-16 w-16 text-white opacity-50" />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={firstDestination}
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}