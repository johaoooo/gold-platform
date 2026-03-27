'use client';

import { useState, useEffect } from 'react';

export default function TerminalLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#050708] flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-10">
          <div className="text-4xl font-black tracking-wider text-green-500" style={{ fontFamily: 'Georgia, serif' }}>
            GOLDEN
          </div>
          <div className="text-sm tracking-[0.3em] text-green-400/60 mt-1">INVEST</div>
        </div>

        {/* Barre de progression */}
        <div className="w-64 mx-auto mb-4">
          <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Pourcentage */}
        <div className="text-green-500/60 text-sm font-mono mb-2">
          {progress}%
        </div>

        {/* Points */}
        <div className="flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-green-500/40"
              style={{
                animation: `pulse 1s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
