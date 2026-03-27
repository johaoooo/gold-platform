'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
          </div>
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between py-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 text-center">
            {/* Badge */}
            <div className="mb-6">
              <span key={current} className="inline-block px-4 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-syne backdrop-blur-sm transition-all duration-500">
                {slides[current].badge}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Georgia, serif', fontWeight: 900 }}>
              Connecter les visionnaires
              <br />
              <span className="text-green-500">aux capitaux</span>
            </h1>

            {/* Description */}
            <div className="h-auto min-h-[80px] flex items-center justify-center mb-10">
              <p key={current} className="text-text-2 font-dm text-lg md:text-xl max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 px-4 py-2 rounded-xl transition-all duration-500">
                {slides[current].description}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
              <Link href="/deposer">
                <button className="group px-8 py-4 text-base font-bold uppercase tracking-wider rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Déposer mon projet
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/projets">
                <button className="group px-8 py-4 text-base font-bold uppercase tracking-wider rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Explorer les projets
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats - Toujours visibles en bas */}
        <div className="relative z-20 w-full">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-green-500/30">
              {statsList.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-4xl font-black text-green-500 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {animate ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
                  </div>
                  <div className="text-text-2 font-dm text-xs uppercase tracking-wider group-hover:text-green-500 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-green-500/80 hover:border-green-500 transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-green-500/80 hover:border-green-500 transition-all duration-300"
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
              background: i === current ? '#22c55e' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </section>
  );
}
