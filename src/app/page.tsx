'use client';

import Link from 'next/link';
import { TrendingUp, Shield, Eye, ArrowRight } from 'lucide-react';
import Hero from '@/components/sections/Hero';

const expertise = [
  {
    num: '01',
    icon: Shield,
    title: 'Sécurité des actifs',
    desc: 'Standards bancaires pour la protection de vos données et le suivi des transactions financières.',
  },
  {
    num: '02',
    icon: TrendingUp,
    title: 'Expertise locale',
    desc: 'Nos analystes basés au Bénin évaluent la pertinence de chaque projet sur le marché ouest-africain.',
  },
  {
    num: '03',
    icon: Eye,
    title: 'Transparence totale',
    desc: "Chaque investisseur dispose d'un tableau de bord pour suivre en temps réel l'évolution de ses placements.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col font-sans bg-bg text-white overflow-x-hidden max-w-full">

      <Hero />

      {/* EXPERTISE */}
      <section className="py-20 md:py-28 px-4 md:px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold/60">Notre protocole</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Un audit{' '}
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-gold-glow), var(--color-gold))'
              }}>
                rigoureux
              </span>
              <br />à chaque étape
            </h2>
            <div className="mt-10 space-y-8">
              {expertise.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.num} className="flex gap-5">
                    <div className="shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="absolute -inset-4 rounded-3xl bg-gold/[0.03] border border-gold/5" />
            <div className="relative p-8 md:p-10 rounded-2xl border border-white/5 bg-surface">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="mb-6 opacity-30">
                <path d="M0 30V18C0 8 6 2 18 0l2 4C12 6 9 10 9 14h9v16H0zm22 0V18C22 8 28 2 40 0l2 4C34 6 31 10 31 14h9v16H22z" fill="var(--color-gold)" />
              </svg>
              <p className="text-white text-lg md:text-xl leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif' }}>
                Bâtir un écosystème où le capital rencontre l&apos;innovation pour transformer durablement l&apos;économie du continent africain.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-10 h-px bg-gold/50" />
                <span className="text-xs uppercase tracking-widest text-gold/50">Notre Vision</span>
              </div>
              <div className="mt-8">
                <Link href="/projets" className="inline-flex items-center gap-2 text-gold text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
                  Voir les projets <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
