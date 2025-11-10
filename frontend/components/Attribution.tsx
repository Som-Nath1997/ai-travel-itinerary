'use client';

export function Attribution() {
  return (
    <footer className="relative py-8 mt-16 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated tagline */}
          <div className="relative inline-block">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">
                Crafted with
              </span>
              <span className="relative inline-block">
                <span className="text-red-500 text-xl animate-pulse">❤️</span>
                <span className="absolute inset-0 text-red-500 text-xl animate-ping opacity-75">❤️</span>
              </span>
              <span className="text-sm text-gray-600 font-medium">
                by
              </span>
            </div>
          </div>

          {/* Animated name with gradient and glow effect */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative px-6 py-3 bg-white rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Som
              </h3>
            </div>
          </div>

          {/* Subtitle with animation */}
          <p className="text-xs text-gray-500 font-light tracking-wider uppercase animate-fade-in-out">
            ✨ Building the Future of Travel Planning ✨
          </p>

          {/* Decorative animated dots */}
          <div className="flex space-x-2 mt-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

