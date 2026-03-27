'use client';

import { useState, useEffect } from 'react';

interface Step {
  text: string;
  completed: boolean;
  active: boolean;
}

export default function TerminalLoader({ onComplete }: { onComplete: () => void }) {
  const [steps, setSteps] = useState<Step[]>([
    { text: 'Connexion au réseau', completed: false, active: false },
    { text: 'Chargement des investisseurs', completed: false, active: false },
    { text: 'Synchronisation des projets', completed: false, active: false },
    { text: 'Préparation de l\'interface', completed: false, active: false },
    { text: 'Sécurisation des données', completed: false, active: false },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        // Activer l'étape en cours
        setSteps(prev => prev.map((step, idx) => ({
          ...step,
          active: idx === currentStep
        })));
        
        // Marquer l'étape comme complétée après un délai
        setTimeout(() => {
          setSteps(prev => prev.map((step, idx) => ({
            ...step,
            completed: idx === currentStep ? true : step.completed,
            active: false
          })));
          setCurrentStep(prev => prev + 1);
        }, 600);
      } else {
        clearInterval(interval);
        setAllComplete(true);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        {/* Logo animé */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="text-4xl font-black tracking-wider text-green-500" style={{ fontFamily: 'Georgia, serif' }}>
              GOLDEN
            </div>
            <div className="text-sm tracking-[0.3em] text-green-400/60 mt-1">INVEST</div>
            <div className="absolute -inset-4 bg-green-500/5 blur-xl rounded-full animate-pulse" />
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              {/* Icône d'état */}
              <div className="w-6 h-6 flex items-center justify-center">
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center animate-scaleIn">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : step.active ? (
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-green-500/20" />
                )}
              </div>
              
              {/* Texte de l'étape */}
              <span className={`
                text-sm font-mono transition-all duration-300
                ${step.completed ? 'text-green-400' : ''}
                ${step.active ? 'text-green-500 font-semibold' : 'text-text-2'}
                ${!step.completed && !step.active ? 'text-text-2/50' : ''}
              `}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {/* Message final */}
        {allComplete && (
          <div className="mt-8 text-center animate-fadeInUp">
            <div className="text-green-500 text-sm font-mono">✓ Prêt à investir</div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-8">
          <div className="h-0.5 bg-green-500/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
