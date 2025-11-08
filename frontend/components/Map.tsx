'use client';

import { useEffect, useRef, useState } from 'react';
import { Location } from '@/lib/api';

interface MapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  dayNumber?: number;
}

// Filter locations that have valid coordinates
function getValidLocations(locations: Location[]): Location[] {
  return locations.filter(loc => loc.lat != null && loc.lng != null && 
                                 typeof loc.lat === 'number' && typeof loc.lng === 'number');
}

export function Map({ locations, center, zoom = 12, dayNumber }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  
  // Filter to only locations with valid coordinates
  const validLocations = getValidLocations(locations);

  useEffect(() => {
    if (!mapRef.current || mapLoaded || validLocations.length === 0) return;

    const loadMap = () => {
      const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!googleMapsApiKey) {
        setMapError('Google Maps API key not configured');
        return;
      }

      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      script.onerror = () => {
        setMapError('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google || validLocations.length === 0) return;

      const defaultCenter = center || (validLocations.length > 0
        ? { lat: validLocations[0].lat!, lng: validLocations[0].lng! }
        : { lat: 0, lng: 0 });

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
      });

      // Add markers for each valid location
      validLocations.forEach((location, index) => {
        if (location.lat != null && location.lng != null) {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            label: {
              text: (index + 1).toString(),
              color: 'white',
            },
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
                ${location.rating ? `<p style="margin: 0; color: #666;">⭐ ${location.rating.toFixed(1)}</p>` : ''}
                ${location.type ? `<p style="margin: 4px 0 0 0; color: #999; font-size: 12px;">${location.type}</p>` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });

      // Fit bounds to show all markers
      if (validLocations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        validLocations.forEach(location => {
          if (location.lat != null && location.lng != null) {
            bounds.extend({ lat: location.lat, lng: location.lng });
          }
        });
        if (validLocations.length > 1) {
          map.fitBounds(bounds);
        }
      }
    };

    loadMap();
  }, [validLocations, center, zoom, mapLoaded]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">{mapError}</p>
      </div>
    );
  }

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
        <p className="text-gray-600">No locations with coordinates available for this day</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

