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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-5xl opacity-10 animate-float">✈️</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🧳</div>
        <div className="absolute bottom-20 left-1/4 text-6xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🗺️</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Animated header */}
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl animate-bounce">🗺️</span>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Itineraries
              </h1>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-semibold text-gray-700">
                {itineraries.length} / 5
              </span>
              <span className="text-gray-500">itineraries</span>
              {itineraries.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse">
                  ✨ Active
                </span>
              )}
            </div>
          </div>
          <Link href="/itineraries/create">
            <Button 
              variant="primary" 
              disabled={itineraries.length >= 5}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all"
            >
              <span className="text-lg">➕</span>
              <span>Create New</span>
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
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-12 text-center border border-white/50 animate-fade-in-up">
            <div className="mb-6">
              <span className="text-6xl animate-bounce block mb-4">🌍</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                No Itineraries Yet
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Create your first AI-powered travel itinerary to get started on your adventure!
              </p>
            </div>
            <Link href="/itineraries/create">
              <Button variant="primary" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all">
                <span className="flex items-center space-x-2">
                  <span className="text-xl">🚀</span>
                  <span>Create Your First Itinerary</span>
                </span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary, index) => (
              <div
                key={itinerary.id}
                className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 hover:shadow-2xl transition-all duration-300 relative group border border-white/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <Link href={`/itineraries/${itinerary.id}`} className="block group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl group-hover:animate-bounce">📍</span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {itinerary.destination}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-3">
                        <span className="text-lg">📅</span>
                        <p className="font-medium">
                          {itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {itinerary.start_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3 bg-gray-50 rounded-lg p-2">
                      <span>🗓️</span>
                      <p>
                        {new Date(itinerary.start_date).toLocaleDateString()}
                        {itinerary.end_date && ` - ${new Date(itinerary.end_date).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 flex items-center space-x-1">
                    <span>✨</span>
                    <span>Created {new Date(itinerary.created_at).toLocaleDateString()}</span>
                  </p>
                </Link>
                <div className="mt-4 flex gap-2">
                  <Link href={`/itineraries/${itinerary.id}/edit`} className="flex-1 group/edit">
                    <Button variant="outline" className="w-full text-sm flex items-center justify-center space-x-1 group-hover/edit:bg-blue-50 transition-colors">
                      <span>✏️</span>
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="flex-1 text-sm flex items-center justify-center space-x-1 hover:bg-red-50 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteConfirm(itinerary.id);
                    }}
                    disabled={deletingId === itinerary.id}
                  >
                    {deletingId === itinerary.id ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        <span>Delete</span>
                      </>
                    )}
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

