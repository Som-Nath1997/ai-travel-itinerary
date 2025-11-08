'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itineraryApi, ItineraryListItem } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function ItinerariesListPage() {
  const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadItineraries();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const data = await itineraryApi.list();
      setItineraries(data);
    } catch (err: any) {
      setError('Failed to load itineraries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await itineraryApi.delete(id);
      // Remove from list
      setItineraries(itineraries.filter(it => it.id !== id));
      setShowDeleteConfirm(null);
    } catch (err: any) {
      setError('Failed to delete itinerary. Please try again.');
    } finally {
      setDeletingId(null);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Itineraries</h1>
            <p className="text-gray-600 mt-1">
              {itineraries.length} / 5 itineraries
            </p>
          </div>
          <Link href="/itineraries/create">
            <Button 
              variant="primary" 
              disabled={itineraries.length >= 5}
            >
              Create New Itinerary
            </Button>
          </Link>
        </div>

        {itineraries.length >= 5 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            You have reached the maximum of 5 itineraries. Delete an existing one to create a new itinerary.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {itineraries.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Itineraries Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first AI-powered travel itinerary to get started!
            </p>
            <Link href="/itineraries/create">
              <Button variant="primary">Create Your First Itinerary</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow relative"
              >
                <Link href={`/itineraries/${itinerary.id}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {itinerary.destination}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}
                  </p>
                  {itinerary.start_date && (
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(itinerary.start_date).toLocaleDateString()}
                      {itinerary.end_date && ` - ${new Date(itinerary.end_date).toLocaleDateString()}`}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Created {new Date(itinerary.created_at).toLocaleDateString()}
                  </p>
                </Link>
                <div className="mt-4 flex gap-2">
                  <Link href={`/itineraries/${itinerary.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="flex-1 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteConfirm(itinerary.id);
                    }}
                    disabled={deletingId === itinerary.id}
                  >
                    {deletingId === itinerary.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Itinerary?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this itinerary? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={deletingId === showDeleteConfirm}
                >
                  {deletingId === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

