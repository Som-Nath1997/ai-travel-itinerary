'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900 flex items-center space-x-2 group relative">
              <span className="text-2xl animate-bounce">✈️</span>
              <span className="group-hover:text-blue-600 transition-colors">AI Travel Itinerary</span>
              <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white animate-pulse shadow-lg">
                <span className="mr-1 animate-spin" style={{ animationDuration: '3s' }}>✨</span>
                by Som
              </span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/itineraries"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg flex items-center space-x-1 group"
                >
                  <span className="group-hover:animate-bounce">🗺️</span>
                  <span>My Itineraries</span>
                </Link>
                <Link
                  href="/itineraries/create"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg flex items-center space-x-1 group"
                >
                  <span className="group-hover:rotate-90 transition-transform">➕</span>
                  <span>Create Itinerary</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.name || user?.email}
                </span>
                <Link href="/profile">
                  <Button variant="outline" className="text-sm">
                    Profile
                  </Button>
                </Link>
                <Button variant="secondary" onClick={logout} className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

