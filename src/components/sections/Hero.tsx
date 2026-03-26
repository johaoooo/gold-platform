'use client';

import { useState, useEffect } from 'react';
import Button from "../ui/Button";

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : 'https://backend-gold-iubc.onrender.com/api';

// Composant compteur personnalisé
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * end);
      setCount(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Hero() {
  const [stats, setStats] = useState({
    projets: 0,
    capitaux: 0,
    satisfaction: 98,
    pays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/stats/`);
      const data = await response.json();
      
      setStats({
        projets: data.total_projets || 0,
        capitaux: data.total_capitaux ? data.total_capitaux / 1000000 : 0,
        satisfaction: data.taux_satisfaction || 98,
        pays: data.pays_couverts || 0
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setStats({
        projets: 240,
        capitaux: 4.2,
        satisfaction: 98,
        pays: 6
      });
    } finally {
      setLoading(false);
    }
  };

  const statsList = [
    { value: stats.projets, label: 'Projets financés', suffix: '+' },
    { value: stats.capitaux, label: 'Capitaux mobilisés', suffix: ' Mrd' },
    { value: stats.satisfaction, label: 'Satisfaction client', suffix: '%' },
    { value: stats.pays, label: 'Pays couverts', suffix: '' },
  ];

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-bg to-green-900/20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-2">Chargement...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-bg to-green-900/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight">
          Connecter les visionnaires
          <br />
          <span className="text-gold">aux capitaux</span>
        </h1>

        <p className="text-text-2 font-dm text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          La plateforme qui met en relation porteurs de projets ambitieux et
          investisseurs stratégiques à travers l'Afrique.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
          <Button variant="gold" size="lg" className="px-8 py-4 text-lg hover:scale-105 transition-transform">
            Déposer mon projet
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg hover:scale-105 transition-transform border-green-500/50 hover:bg-green-500/10">
            Explorer les projets
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-green-500/30 pt-12">
          {statsList.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl font-playfair text-gold font-bold mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-text-2 font-dm text-sm uppercase tracking-wider group-hover:text-gold transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
