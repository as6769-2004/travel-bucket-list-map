"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import LeafletMap from "./LeafletMap";

export default function InteractiveMap({ packages, onDestinationSelect, selectedDestination }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Map...
          </h3>
          <p className="text-gray-600">
            Please wait while we load the interactive map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LeafletMap 
      packages={packages} 
      onDestinationSelect={onDestinationSelect} 
      selectedDestination={selectedDestination} 
    />
  );
}