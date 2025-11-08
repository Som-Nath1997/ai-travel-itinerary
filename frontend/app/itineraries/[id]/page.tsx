'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itineraryApi, Itinerary } from '@/lib/api';
import { Map } from '@/components/Map';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function ItineraryDetailPage() {
  const params = useParams();
  const itineraryId = params.id as string;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadItinerary();
    }
  }, [itineraryId, isAuthenticated, authLoading, router]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      const data = await itineraryApi.getById(itineraryId);
      setItinerary(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Itinerary not found'}
          </div>
          <Link href="/itineraries">
            <Button variant="primary" className="mt-4">
              Back to Itineraries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate center for map (average of all locations)
  const allLocations = itinerary.day_plans.flatMap(day => day.locations);
  const validLocations = allLocations.filter(loc => loc.lat && loc.lng);
  const center = validLocations.length > 0
    ? {
        lat: validLocations.reduce((sum, loc) => sum + loc.lat!, 0) / validLocations.length,
        lng: validLocations.reduce((sum, loc) => sum + loc.lng!, 0) / validLocations.length,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/itineraries" className="text-blue-600 hover:text-blue-800">
            ← Back to Itineraries
          </Link>
          <Link href={`/itineraries/${itineraryId}/edit`}>
            <Button variant="outline">Edit Itinerary</Button>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {itinerary.destination}
              </h1>
              <p className="text-gray-600">
                {itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'} itinerary
              </p>
              {itinerary.start_date && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(itinerary.start_date).toLocaleDateString()}
                  {itinerary.end_date && ` - ${new Date(itinerary.end_date).toLocaleDateString()}`}
                </p>
              )}
            </div>
          </div>

          {/* Overall Map */}
          {validLocations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Locations</h2>
              <Map locations={validLocations} center={center} />
            </div>
          )}

          {/* Day Plans */}
          <div className="space-y-8">
            {itinerary.day_plans.map((dayPlan, index) => {
              const dayLocations = dayPlan.locations.filter(loc => loc.lat && loc.lng);
              const dayCenter = dayLocations.length > 0
                ? {
                    lat: dayLocations.reduce((sum, loc) => sum + loc.lat!, 0) / dayLocations.length,
                    lng: dayLocations.reduce((sum, loc) => sum + loc.lng!, 0) / dayLocations.length,
                  }
                : undefined;

              return (
                <div key={dayPlan.day_number} className="border-t pt-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                      {dayPlan.day_number}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Day {dayPlan.day_number}
                    </h2>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {dayPlan.description}
                  </p>

                  {dayLocations.length > 0 && (
                    <div className="mb-6">
                      <Map locations={dayLocations} center={dayCenter} dayNumber={dayPlan.day_number} />
                    </div>
                  )}

                  {dayPlan.locations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Locations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dayPlan.locations.map((location, locIndex) => (
                          <div
                            key={locIndex}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-semibold text-gray-900 mb-1">{location.name}</h4>
                            {location.rating && (
                              <p className="text-sm text-gray-600 mb-1">
                                ⭐ {location.rating.toFixed(1)}
                              </p>
                            )}
                            {location.type && (
                              <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                            )}
                            {location.lat && location.lng && (
                              <p className="text-xs text-gray-400 mt-2">
                                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

