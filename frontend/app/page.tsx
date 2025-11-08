'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Travel Itinerary Generator
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Generate personalized, day-by-day travel plans using AI
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back, {user?.name || user?.email}!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/itineraries">
                  <Button variant="primary">My Itineraries</Button>
                </Link>
                <Link href="/itineraries/create">
                  <Button variant="outline">Create New Itinerary</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Generate intelligent travel plans using OpenAI
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Real Data</h3>
              <p className="text-gray-600">
                Integrated with Google Places for accurate locations
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
              <p className="text-gray-600">
                Create your itinerary in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

