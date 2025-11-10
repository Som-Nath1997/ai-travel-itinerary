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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/itineraries" className="text-blue-600 hover:text-blue-800">
            ← Back to Itineraries
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Itinerary</h1>
          <p className="text-gray-600 mb-6">
            Enter your destination and preferences, and we&apos;ll generate a personalized travel plan using AI.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Destination *"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              placeholder="e.g., Paris, France"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days) *
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((days) => (
                  <option key={days} value={days}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Start Date (optional)"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (optional)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferences (optional)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Interested in museums, prefer vegetarian restaurants, budget-friendly options"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
              </Button>
              <Link href="/itineraries">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>

            {isLoading && (
              <div className="text-center text-gray-600">
                <p>This may take a few seconds...</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

