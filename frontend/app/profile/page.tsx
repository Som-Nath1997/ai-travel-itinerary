'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <div className="space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>

            {user.name && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user.name}</p>
              </div>
            )}

            {user.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Member since</label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Link href="/itineraries/create">
                    <Button variant="primary">Create New Itinerary</Button>
                  </Link>
                  <Link href="/itineraries">
                    <Button variant="outline">View My Itineraries</Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600">
                  Your account is set up and ready to use. Create your first AI-powered travel itinerary!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

