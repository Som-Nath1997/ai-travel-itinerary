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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float">✈️</div>
        <div className="absolute bottom-20 left-10 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🌍</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🧳</div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Animated header card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-6 border border-white/50 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-4xl animate-bounce">👤</span>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Profile
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-purple-500 rounded-lg text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
                  <span className="text-lg">🏠</span>
                  <span>Home</span>
                </button>
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile info cards with animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 animate-slide-in-left">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">📧</span>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                </div>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>

              {user.name && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 animate-slide-in-right">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">👤</span>
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{user.name}</p>
                </div>
              )}

              {user.created_at && (
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200 animate-slide-in-left md:col-span-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📅</span>
                    <label className="block text-sm font-semibold text-gray-700">Member since</label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions with enhanced design */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl animate-pulse">⚡</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/itineraries/create" className="flex-1 group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl group-hover:rotate-12 transition-transform">➕</span>
                        <h3 className="text-xl font-bold">Create New Itinerary</h3>
                      </div>
                      <p className="text-blue-100 text-sm">Plan your next adventure with AI</p>
                    </div>
                  </Link>
                  <Link href="/itineraries" className="flex-1 group">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl group-hover:animate-bounce">🗺️</span>
                        <h3 className="text-xl font-bold">View My Itineraries</h3>
                      </div>
                      <p className="text-purple-100 text-sm">See all your travel plans</p>
                    </div>
                  </Link>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <p className="text-sm text-gray-700 flex-1">
                    <strong>Ready to explore?</strong> Create your first AI-powered travel itinerary and let our intelligent system plan the perfect trip for you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

