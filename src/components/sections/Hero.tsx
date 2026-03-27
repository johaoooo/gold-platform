'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from "../ui/Button";

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : 'https://backend-gold-iubc.onrender.com/api';

const slides = [
  {
    image: '/images/hero/agriculture.jpg',
    title: 'Agriculture Durable',
    description: "Investissez dans des projets agricoles innovants qui transforment le continent",
    badge: 'AgriTech',
  },
  {
    image: '/images/hero/tech.jpg',
    title: 'Innovation Technologique',
    description: "Soutenez les startups qui façonnent l'Afrique de demain",
    badge: 'Tech',
  },
  {
    image: '/images/hero/energie.jpg',
    title: 'Énergie Verte',
    description: 'Participez à la transition énergétique africaine',
    badge: 'Énergie',
  },
  {
    image: '/images/hero/immobilier.jpg',
    title: 'Immobilier Durable',
    description: 'Investissez dans des projets immobiliers à fort impact social',
    badge: 'Immobilier',
  },
];

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [stats, setStats] = useState({ projets: 240, capitaux: 4.2, satisfaction: 98, pays: 6 });
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/projects/stats/`)
      .then(r => r.json())
      .then(data => setStats({
        projets: data.total_projets || 240,
        capitaux: data.total_capitaux ? data.total_capitaux / 1000000 : 4.2,
        satisfaction: data.taux_satisfaction || 98,
        pays: data.pays_couverts || 6,
      }))
      .catch(() => {});
    setTimeout(() => setAnimate(true), 500);

    // Autoplay
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent((index + slides.length) % slides.length);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
  };

  const statsList = [
    { value: stats.projets,      label: 'Projets financés',   suffix: '+' },
    { value: stats.capitaux,     label: 'Capitaux mobilisés', suffix: ' Mrd' },
    { value: stats.satisfaction, label: 'Satisfaction client', suffix: '%' },
    { value: stats.pays,         label: 'Pays couverts',      suffix: '' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* Slides en arrière-plan */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: i === current ? 1 : 0,
            }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/75" />
          </div>
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-20 min-h-screen flex items-center justify-end pb-32 pt-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <div className="mb-6">
            <span key={current} className="inline-block px-4 py-1 bg-gold/20 text-gold rounded-full text-sm font-syne backdrop-blur-sm" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              {slides[current].badge}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-playfair text-white mb-4 leading-tight">
            Connecter les visionnaires
            <br />
            <span className="text-gold">aux capitaux</span>
          </h1>

          <div className="h-16 flex items-center justify-center mb-10">
            <p key={current} className="text-text-2 font-dm text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              {slides[current].description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link href="/deposer">
              <Button variant="gold" size="lg" className="px-8 py-4 text-lg hover:scale-105 transition-transform">
                Déposer mon projet
              </Button>
            </Link>
            <Link href="/projets">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg hover:scale-105 transition-transform border-green-500/50 hover:bg-green-500/10">
                Explorer les projets
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-green-500/30 pt-12">
            {statsList.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-playfair text-gold font-bold mb-2">
                  {animate ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
                </div>
                <div className="text-text-2 font-dm text-sm uppercase tracking-wider group-hover:text-gold transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flèches */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-gold/80 hover:border-gold transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-gold/80 hover:border-gold transition-all duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: '8px',
              width: i === current ? '32px' : '8px',
              borderRadius: '4px',
              background: i === current ? '#f0a500' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
