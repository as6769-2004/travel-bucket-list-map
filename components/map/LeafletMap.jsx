"use client";

import { useEffect, useRef } from "react";

export default function LeafletMap({ packages, onDestinationSelect, selectedDestination }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Fix default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize map
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics'
          }).addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add markers for packages with fallback coordinates
        const destinations = [
          { name: "Goa", country: "India", latitude: 15.2993, longitude: 74.1240 },
          { name: "Jaipur", country: "India", latitude: 26.9124, longitude: 75.7873 },
          { name: "Kashmir", country: "India", latitude: 34.0837, longitude: 74.7973 },
          { name: "Kerala", country: "India", latitude: 10.8505, longitude: 76.2711 },
          { name: "Agra", country: "India", latitude: 27.1767, longitude: 78.0081 },
          { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708 }
        ];

        const imageUrls = [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=60&h=60&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=60&h=60&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=60&h=60&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=60&h=60&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=60&h=60&fit=crop&crop=center'
        ];

        packages.forEach((pkg, index) => {
          const dest = pkg.destinations?.[0] || destinations[index] || destinations[0];
          const lat = dest.latitude || destinations[index]?.latitude || 20.5937;
          const lng = dest.longitude || destinations[index]?.longitude || 78.9629;
          const imageUrl = pkg.image || imageUrls[index] || imageUrls[0];
          
          const customIcon = L.divIcon({
            html: `<div class="relative transform hover:scale-110 transition-all duration-300 cursor-pointer">
                     <div class="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                       <img src="${imageUrl}" class="w-full h-full object-cover" style="display:block">
                     </div>
                     <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-200">
                       <span class="text-xs font-bold text-gray-800">${dest.name}</span>
                     </div>
                     <div class="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></div>
                   </div>`,
            className: 'snapchat-marker',
            iconSize: [80, 100],
            iconAnchor: [40, 90]
          });
          
          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);

          // Remove popup binding

          marker.on('click', () => {
            onDestinationSelect?.(pkg);
          });

          markersRef.current.push(marker);
        });

        // Highlight selected package
        if (selectedDestination && selectedDestination.destinations) {
          selectedDestination.destinations.forEach((dest) => {
            if (dest.latitude && dest.longitude) {
              const selectedMarker = L.circleMarker([
                parseFloat(dest.latitude),
                parseFloat(dest.longitude)
              ], {
                radius: 15,
                fillColor: "#3b82f6",
                color: "#1d4ed8",
                weight: 3,
                opacity: 0.8,
                fillOpacity: 0.3
              }).addTo(mapInstanceRef.current);

              markersRef.current.push(selectedMarker);
            }
          });
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [packages, selectedDestination, onDestinationSelect]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}