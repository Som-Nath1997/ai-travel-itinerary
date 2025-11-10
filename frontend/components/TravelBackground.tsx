'use client';

export function TravelBackground() {
  const travelIcons = ['✈️', '🧳', '🗺️', '🌍', '🏖️', '🏔️', '🎒', '📸', '🚂', '⛵', '🏛️', '🌴'];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-gradient-shift"></div>
      
      {/* Floating travel icons */}
      {travelIcons.map((icon, index) => (
        <div
          key={index}
          className="absolute text-4xl md:text-5xl opacity-20 animate-float"
          style={{
            left: `${(index * 8.33) % 100}%`,
            top: `${(index * 12) % 100}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${8 + (index % 4)}s`,
          }}
        >
          {icon}
        </div>
      ))}
      
      {/* Animated clouds */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-cloud-1">☁️</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-cloud-2">☁️</div>
      <div className="absolute bottom-32 left-1/4 text-7xl opacity-10 animate-cloud-3">☁️</div>
      
      {/* Animated sun */}
      <div className="absolute top-10 right-10 text-5xl opacity-20 animate-spin-slow">☀️</div>
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

