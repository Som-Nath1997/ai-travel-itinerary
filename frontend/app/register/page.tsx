'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TravelBackground } from '@/components/TravelBackground';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name || undefined);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <TravelBackground />
      
      {/* Main content with glassmorphism */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Animated header */}
        <div className="text-center animate-slide-down">
          <div className="inline-block mb-4">
            <span className="text-5xl animate-bounce">🌍</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-2">
            Start Your Adventure!
          </h2>
          <p className="text-lg text-white/90 font-medium">
            Create your account and plan amazing trips
          </p>
          <p className="mt-4 text-sm text-white/80">
            Or{' '}
            <Link href="/login" className="font-semibold text-yellow-300 hover:text-yellow-200 underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {/* Glassmorphism form card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400 text-red-100 px-4 py-3 rounded-lg animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  <span className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>Name (optional)</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  <span className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>Email address</span>
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  <span className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Password</span>
                  </span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading} 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin">✈️</span>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎉</span>
                    <span>Begin Your Journey</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

