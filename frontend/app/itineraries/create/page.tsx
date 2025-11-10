'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itineraryApi, ItineraryCreateData } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Link from 'next/link';

export default function CreateItineraryPage() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data: ItineraryCreateData = {
        destination: destination.trim(),
        duration: parseInt(duration.toString()),
        start_date: startDate || undefined,
        budget: budget.trim() || undefined,
        preferences: preferences.trim() || undefined,
      };

      const itinerary = await itineraryApi.generate(data);
      router.push(`/itineraries/${itinerary.id}`);
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || err.message || 'Failed to generate itinerary. Please try again.';
      
      // Check for quota/billing errors
      if (err.response?.status === 402 || errorDetail.includes('quota') || errorDetail.includes('billing')) {
        setError('OpenAI API quota exceeded. Please check your OpenAI account billing and add credits to continue generating itineraries.');
      } else {
        setError(errorDetail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float">✈️</div>
        <div className="absolute bottom-20 left-10 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🗺️</div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🧳</div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-6 animate-slide-in-left">
          <Link href="/itineraries" className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Itineraries</span>
          </Link>
        </div>

        {/* Animated header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block mb-4">
            <span className="text-6xl animate-bounce">🌍</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Create New Itinerary
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Enter your destination and preferences, and we&apos;ll generate a personalized travel plan using AI ✨
          </p>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-lg">📅</span>
                <span>Duration (days) *</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                required
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((days) => (
                  <option key={days} value={days}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
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
              <p className="mt-1 text-sm text-gray-500">
                Select a budget range to help AI suggest appropriate activities and restaurants
              </p>
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
                placeholder="e.g., Interested in museums, prefer vegetarian restaurants, budget-friendly options"
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
                    <span className="animate-spin text-xl">✈️</span>
                    <span>Generating Itinerary...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="text-xl">🚀</span>
                    <span>Generate Itinerary</span>
                  </span>
                )}
              </Button>
              <Link href="/itineraries">
                <Button type="button" variant="outline" className="px-6">
                  Cancel
                </Button>
              </Link>
            </div>

            {isLoading && (
              <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <span className="text-2xl animate-spin">⏳</span>
                  <p className="font-medium">AI is crafting your perfect itinerary... This may take a few seconds</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

