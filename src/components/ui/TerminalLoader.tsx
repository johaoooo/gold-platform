'use client';

import { useState, useEffect } from 'react';

interface TerminalLine {
  text: string;
  type?: 'normal' | 'success' | 'error' | 'progress';
  progress?: number;
}

const initialLines: TerminalLine[] = [
  { text: '> Initialisation du système Golden Invest...', type: 'normal' },
  { text: '> Connexion aux serveurs...', type: 'normal' },
  { text: '> Authentification en cours...', type: 'normal' },
  { text: '> Chargement des données...', type: 'progress', progress: 0 },
  { text: '> Synchronisation des projets...', type: 'normal' },
  { text: '> Connexion aux investisseurs...', type: 'normal' },
  { text: '> Finalisation...', type: 'normal' },
];

export default function TerminalLoader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Ajouter les lignes une par une
    const interval = setInterval(() => {
      if (currentLineIndex < initialLines.length) {
        const newLine = initialLines[currentLineIndex];
        setLines(prev => [...prev, { ...newLine }]);
        
        // Si c'est une ligne de progression, démarrer l'animation
        if (newLine.type === 'progress') {
          const progressInterval = setInterval(() => {
            setProgress(p => {
              if (p >= 100) {
                clearInterval(progressInterval);
                return 100;
              }
              return p + 5;
            });
          }, 50);
        }
        
        setCurrentLineIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        // Attendre 1 seconde puis terminer
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [currentLineIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="bg-black/90 border border-green-500/30 rounded-lg p-6 font-mono text-sm shadow-2xl shadow-green-500/10">
          {/* En-tête du terminal */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/30">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-green-500/60 text-xs ml-2">golden-invest@terminal:~</span>
          </div>

          {/* Contenu du terminal */}
          <div className="space-y-2">
            {lines.map((line, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-green-500/60">$</span>
                <div className="flex-1">
                  <span className={`
                    ${line.type === 'success' ? 'text-green-400' : ''}
                    ${line.type === 'error' ? 'text-red-400' : ''}
                    ${line.type === 'normal' ? 'text-green-400' : ''}
                  `}>
                    {line.text}
                  </span>
                  {line.type === 'progress' && (
                    <div className="mt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-green-500/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-green-400 text-xs font-mono">{progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Curseur clignotant */}
            {currentLineIndex >= initialLines.length && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-500/60">$</span>
                <span className="text-green-400 animate-pulse">▊</span>
              </div>
            )}
          </div>

          {/* Pied de terminal */}
          <div className="mt-4 pt-3 border-t border-green-500/30">
            <div className="flex justify-between text-[10px] text-green-500/40">
              <span>Golden Invest v2.0</span>
              <span>Terminal prêt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
