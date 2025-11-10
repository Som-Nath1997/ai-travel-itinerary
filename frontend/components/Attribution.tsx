'use client';

export function Attribution() {
  return (
    <footer className="relative py-12 mt-16 border-t border-gray-200 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Main animated tagline */}
          <div className="relative inline-block">
            <div className="flex items-center space-x-3">
              <span className="text-base text-gray-700 font-semibold">
                Crafted with
              </span>
              <span className="relative inline-block">
                <span className="text-red-500 text-2xl animate-pulse">❤️</span>
                <span className="absolute inset-0 text-red-500 text-2xl animate-ping opacity-75">❤️</span>
              </span>
              <span className="text-base text-gray-700 font-semibold">
                by
              </span>
            </div>
          </div>

          {/* Enhanced animated name with multiple effects */}
          <div className="relative group cursor-pointer">
            {/* Outer glow rings */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main card */}
            <div className="relative px-8 py-4 bg-white rounded-xl shadow-2xl transform group-hover:scale-110 transition-all duration-300 border-2 border-transparent group-hover:border-purple-300">
              <div className="flex items-center space-x-3">
                {/* Sparkle icon */}
                <span className="text-2xl animate-spin" style={{ animationDuration: '2s' }}>
                  ⭐
                </span>
                <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  Som
                </h3>
                <span className="text-2xl animate-bounce">🚀</span>
              </div>
            </div>
          </div>

          {/* Enhanced subtitle with more animation */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 font-medium tracking-wider uppercase animate-fade-in-out">
              ✨ Building the Future of Travel Planning ✨
            </p>
            <p className="text-xs text-gray-500 italic">
              Powered by AI • Enhanced with Passion
            </p>
          </div>

          {/* Enhanced decorative elements */}
          <div className="flex items-center space-x-3 mt-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mx-2"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.8s' }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

