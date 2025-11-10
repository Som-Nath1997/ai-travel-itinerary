'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">✈️</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🌍</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🗺️</div>
        <div className="absolute bottom-40 right-1/3 text-6xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🧳</div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated header */}
          <div className="mb-8 animate-slide-down">
            <div className="inline-block mb-6">
              <span className="text-7xl animate-bounce">✈️</span>
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              AI Travel Itinerary Generator
            </h1>
            <p className="text-2xl text-gray-700 font-medium mb-2">
              Generate personalized, day-by-day travel plans using AI ✨
            </p>
            <p className="text-lg text-gray-600">
              Your perfect adventure is just one click away
            </p>
          </div>

          {isAuthenticated ? (
            <div className="space-y-6 mb-16 animate-fade-in-up">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
                <p className="text-xl text-gray-700 font-semibold mb-2">
                  Welcome back, <span className="text-blue-600 font-bold">{user?.name || user?.email}</span>! 👋
                </p>
                <p className="text-gray-600 mb-4">Ready to plan your next adventure?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/itineraries" className="group">
                    <Button variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform group-hover:scale-105 transition-all">
                      <span className="flex items-center space-x-2">
                        <span>🗺️</span>
                        <span>My Itineraries</span>
                      </span>
                    </Button>
                  </Link>
                  <Link href="/itineraries/create" className="group">
                    <Button variant="outline" className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transform group-hover:scale-105 transition-all">
                      <span className="flex items-center space-x-2">
                        <span>➕</span>
                        <span>Create New Itinerary</span>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up">
              <Link href="/login" className="group">
                <Button variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform group-hover:scale-105 transition-all px-8 py-3 text-lg">
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Sign In</span>
                  </span>
                </Button>
              </Link>
              <Link href="/register" className="group">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transform group-hover:scale-105 transition-all px-8 py-3 text-lg">
                  <span className="flex items-center space-x-2">
                    <span>🎉</span>
                    <span>Create Account</span>
                  </span>
                </Button>
              </Link>
            </div>
          )}

          {/* Feature cards with animations */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4 group-hover:animate-bounce">🤖</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                AI-Powered
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Generate intelligent travel plans using advanced AI technology
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4 group-hover:animate-bounce">📍</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Real Data
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Integrated with Google Places for accurate locations and ratings
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl mb-4 group-hover:animate-bounce">⚡</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-3">
                Fast & Easy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Create your perfect itinerary in seconds, not hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

