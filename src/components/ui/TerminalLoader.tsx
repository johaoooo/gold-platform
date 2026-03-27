'use client';

import { useState, useEffect } from 'react';
import { 
  Network, Users, FolderSync, TrendingUp, Shield, Sparkles,
  CheckCircle, Loader2, Circle
} from 'lucide-react';

export default function TerminalLoader({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Connexion au réseau', icon: Network, time: 400 },
    { label: 'Chargement des investisseurs', icon: Users, time: 500 },
    { label: 'Synchronisation des projets', icon: FolderSync, time: 450 },
    { label: 'Analyse des rendements', icon: TrendingUp, time: 400 },
    { label: 'Sécurisation des transactions', icon: Shield, time: 450 },
    { label: 'Initialisation de l\'interface', icon: Sparkles, time: 500 },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStep = (index: number) => {
      if (index >= steps.length) {
        setTimeout(() => {
          onComplete();
        }, 600);
        return;
      }

      setActiveStep(index);
      
      let currentProgress = 0;
      progressInterval = setInterval(() => {
        currentProgress += 2;
        if (currentProgress <= 100) {
          setProgress(currentProgress);
        } else {
          clearInterval(progressInterval);
        }
      }, steps[index].time / 50);

      timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        setProgress(0);
        runStep(index + 1);
      }, steps[index].time);
    };

    runStep(0);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [steps.length, onComplete]);

  const getIcon = (Icon: React.ElementType, isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    if (isActive) {
      return <Loader2 size={16} className="text-green-500 animate-spin" />;
    }
    return <Icon size={16} className="text-gray-600" />;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-[#0a0c10] to-[#050708] flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto px-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-green-500/5 blur-xl rounded-3xl" />
          
          <div className="relative bg-[#0a0c10]/90 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-black/40 border-b border-green-500/20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-green-500/40 text-[11px] font-mono tracking-wide">
                golden-invest@launcher:~
              </div>
              <div className="w-14" />
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="text-3xl font-black tracking-wider text-green-500" style={{ fontFamily: 'Georgia, serif' }}>
                    GOLDEN
                  </div>
                  <div className="text-[10px] tracking-[0.3em] text-green-400/50 mt-0.5">INVEST</div>
                  <div className="absolute -inset-3 bg-green-500/10 blur-xl rounded-full animate-pulse" />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-6">
                {steps.map((step, idx) => {
                  const isCompleted = completedSteps.includes(idx);
                  const isActive = activeStep === idx;
                  const Icon = step.icon;

                  return (
                    <div key={idx} className="flex items-center gap-3 py-1.5">
                      <div className="w-6 flex-shrink-0">
                        {getIcon(Icon, isCompleted, isActive)}
                      </div>

                      <span className={`
                        flex-1 font-mono text-sm transition-all duration-300
                        ${isCompleted ? 'text-green-400' : ''}
                        ${isActive ? 'text-green-500' : 'text-gray-500'}
                        ${!isCompleted && !isActive ? 'text-gray-600' : ''}
                      `}>
                        {step.label}
                      </span>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="mt-4 pt-2">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1.5">
                  <span>Initialisation</span>
                  <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
                </div>
                <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-black/30 border-t border-green-500/20">
              <div className="flex justify-between text-[9px] text-green-500/40 font-mono">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Golden Invest Terminal v3.0</span>
                </div>
                <div className="flex gap-3">
                  <span>🤝 Connexion</span>
                  <span>⚡ Prêt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
