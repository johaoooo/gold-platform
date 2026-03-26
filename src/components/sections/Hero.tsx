'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Button from "../ui/Button";

// Importer Swiper dynamiquement pour éviter les erreurs SSR
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

// Importer les modules et les styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : 'https://backend-gold-iubc.onrender.com/api';

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

const slides = [
  {
    image: '/images/hero/agriculture.jpg',
    title: 'Agriculture Durable',
    description: 'Investissez dans des projets agricoles innovants qui transforment le continent',
    badge: 'AgriTech'
  },
  {
    image: '/images/hero/tech.jpg',
    title: 'Innovation Technologique',
    description: 'Soutenez les startups qui façonnent l\'Afrique de demain',
    badge: 'Tech'
  },
  {
    image: '/images/hero/energie.jpg',
    title: 'Énergie Verte',
    description: 'Participez à la transition énergétique africaine',
    badge: 'Énergie'
  },
  {
    image: '/images/hero/immobilier.jpg',
    title: 'Immobilier Durable',
    description: 'Investissez dans des projets immobiliers à fort impact social',
    badge: 'Immobilier'
  }
];

export default function Hero() {
  const [stats, setStats] = useState({
    projets: 0,
    capitaux: 0,
    satisfaction: 98,
    pays: 0
  });
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
    setTimeout(() => setAnimate(true), 500);
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
    <section className="relative min-h-screen overflow-hidden">
      {/* Carrousel d'arrière-plan - seulement si monté côté client */}
      {isMounted && Swiper && (
        <Swiper
          modules={[]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
          loop={true}
          className="absolute inset-0 h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-1 bg-gold/20 text-gold rounded-full text-sm font-syne mb-4 backdrop-blur-sm">
              🌍 Investissement stratégique en Afrique
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight">
            Connecter les visionnaires
            <br />
            <span className="text-gold">aux capitaux</span>
          </h1>

          <p className="text-text-2 font-dm text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed backdrop-blur-sm bg-black/20 px-4 py-2 rounded-xl">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-green-500/30 pt-12 backdrop-blur-sm">
            {statsList.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-playfair text-gold font-bold mb-2">
                  {animate ? (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  ) : (
                    `0${stat.suffix || ''}`
                  )}
                </div>
                <div className="text-text-2 font-dm text-sm uppercase tracking-wider group-hover:text-gold transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="swiper-pagination-custom absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3" />
      
      <style jsx>{`
        :global(.swiper-pagination-custom .swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.5);
          opacity: 1;
          transition: all 0.3s;
        }
        :global(.swiper-pagination-custom .swiper-pagination-bullet-active) {
          background: #f0a500;
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
}
