'use client';

import { useState, useEffect } from 'react';

export function FloatingAttribution() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-hide after 5 seconds, show on hover
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ${
        isVisible || isHovered ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Multiple glow effects for depth */}
      <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50"></div>
      
      {/* Main badge with glassmorphism */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-full shadow-2xl border-2 border-white/50 px-5 py-3 transform transition-all duration-300 hover:scale-110 cursor-pointer hover:shadow-3xl">
        <div className="flex items-center space-x-2">
          {/* Animated sparkle with rotation */}
          <span className="text-yellow-400 text-xl animate-spin drop-shadow-lg" style={{ animationDuration: '2s' }}>
            ✨
          </span>
          
          {/* Text with gradient */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Made by</span>
            <span className="text-base font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x drop-shadow-sm">
              Som
            </span>
          </div>
          
          {/* Animated heart with multiple effects */}
          <span className="relative">
            <span className="text-red-500 text-lg animate-pulse drop-shadow-lg">❤️</span>
            <span className="absolute inset-0 text-red-500 text-lg animate-ping opacity-50">❤️</span>
          </span>
        </div>
      </div>

      {/* Enhanced tooltip on hover */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs rounded-xl shadow-2xl whitespace-nowrap animate-fade-in border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-base animate-bounce">🚀</span>
            <div>
              <div className="font-bold">Building Amazing Experiences</div>
              <div className="text-xs text-gray-400 mt-0.5">AI-Powered Travel Planning</div>
            </div>
          </div>
          {/* Arrow with gradient */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

