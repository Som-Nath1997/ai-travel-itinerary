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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/itineraries/${itineraryId}`} className="text-blue-600 hover:text-blue-800">
            ← Back to Itinerary
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Itinerary</h1>

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

            <Input
              label="Start Date (optional)"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label="End Date (optional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (optional)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferences (optional)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Interested in museums, prefer vegetarian restaurants"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/itineraries/${itineraryId}`}>
                <Button type="button" variant="outline">
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

