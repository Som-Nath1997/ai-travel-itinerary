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

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itineraryId, isAuthenticated, authLoading, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">🗺️</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>📍</div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '4s' }}>✈️</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6 flex justify-between items-center animate-slide-down">
          <Link href="/itineraries" className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Itineraries</span>
          </Link>
          <Link href={`/itineraries/${itineraryId}/edit`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>✏️</span>
              <span>Edit Itinerary</span>
            </Button>
          </Link>
        </div>

        {/* Animated header card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8 border border-white/50 animate-fade-in-up">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-4xl animate-bounce">📍</span>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {itinerary.destination}
                </h1>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📅</span>
                  <p className="font-semibold">
                    {itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'} itinerary
                  </p>
                </div>
                {itinerary.start_date && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>🗓️</span>
                    <p>
                      {new Date(itinerary.start_date).toLocaleDateString()}
                      {itinerary.end_date && ` - ${new Date(itinerary.end_date).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overall Map */}
          {validLocations.length > 0 && (
            <div className="mb-8 animate-slide-in-up">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🗺️</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Locations
                </h2>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl border-2 border-white/50">
                <Map locations={validLocations} center={center} />
              </div>
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
                <div 
                  key={dayPlan.day_number} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4 shadow-lg animate-pulse">
                      {dayPlan.day_number}
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Day {dayPlan.day_number}
                    </h2>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed text-lg bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    {dayPlan.description}
                  </p>

                  {dayLocations.length > 0 && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-lg border-2 border-white/50">
                      <Map locations={dayLocations} center={dayCenter} dayNumber={dayPlan.day_number} />
                    </div>
                  )}

                  {dayPlan.locations.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">📍</span>
                        <h3 className="text-xl font-bold text-gray-900">Locations</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dayPlan.locations.map((location, locIndex) => (
                          <div
                            key={locIndex}
                            className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                {location.name}
                              </h4>
                              <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📍</span>
                            </div>
                            {location.rating && (
                              <div className="flex items-center space-x-1 mb-2">
                                <span className="text-yellow-500 text-lg">⭐</span>
                                <p className="text-sm font-semibold text-gray-700">
                                  {location.rating.toFixed(1)} rating
                                </p>
                              </div>
                            )}
                            {location.type && (
                              <p className="text-xs text-gray-600 bg-white rounded-full px-3 py-1 inline-block mb-2 capitalize font-medium">
                                {location.type}
                              </p>
                            )}
                            {location.lat && location.lng && (
                              <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                                <span>🌐</span>
                                <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
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

