'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itineraryApi, Itinerary, ItineraryUpdateData } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Link from 'next/link';

export default function EditItineraryPage() {
  const params = useParams();
  const itineraryId = params.id as string;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const loadItinerary = async () => {
    try {
      setLoading(true);
      const data = await itineraryApi.getById(itineraryId);
      setItinerary(data);
      setDestination(data.destination);
      setStartDate(data.start_date || '');
      setEndDate(data.end_date || '');
      setBudget(data.budget || '');
      setPreferences(data.preferences || '');
    } catch (err: any) {
      setError('Failed to load itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (itineraryId) {
      loadItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itineraryId, isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updateData: ItineraryUpdateData = {
        destination: destination.trim(),
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        budget: budget.trim() || undefined,
        preferences: preferences.trim() || undefined,
      };

      await itineraryApi.update(itineraryId, updateData);
      router.push(`/itineraries/${itineraryId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !itinerary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float">✏️</div>
        <div className="absolute bottom-20 left-10 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>📝</div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-6 animate-slide-in-left">
          <Link href={`/itineraries/${itineraryId}`} className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Itinerary</span>
          </Link>
        </div>

        {/* Animated header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block mb-4">
            <span className="text-6xl animate-bounce">✏️</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Itinerary
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/50 animate-fade-in-up">

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-shake flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span className="text-lg">📍</span>
                <span>Destination *</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span className="text-lg">🗓️</span>
                <span>Start Date (optional)</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span className="text-lg">🗓️</span>
                <span>End Date (optional)</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span>Budget (optional)</span>
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
              >
                <option value="">Select budget range</option>
                <option value="budget-friendly">Budget-friendly ($0-50/day)</option>
                <option value="moderate">Moderate ($50-150/day)</option>
                <option value="comfortable">Comfortable ($150-300/day)</option>
                <option value="luxury">Luxury ($300+/day)</option>
                <option value="custom">Custom (specify in preferences)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-lg">💭</span>
                <span>Preferences (optional)</span>
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 resize-none"
                placeholder="e.g., Interested in museums, prefer vegetarian restaurants"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin text-xl">💾</span>
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="text-xl">✅</span>
                    <span>Save Changes</span>
                  </span>
                )}
              </Button>
              <Link href={`/itineraries/${itineraryId}`}>
                <Button type="button" variant="outline" className="px-6">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

