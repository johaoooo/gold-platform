'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Shield, Eye, ArrowRight, Sparkles, Globe } from 'lucide-react';
import Hero from '@/components/sections/Hero';

const expertise = [
  {
    num: '01',
    icon: Shield,
    title: 'Sécurité des actifs',
    desc: 'Standards bancaires pour la protection de vos données et le suivi des transactions financières.',
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774608848/ag_orpvjl.jpg',
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-500',
  },
  {
    num: '02',
    icon: TrendingUp,
    title: 'Expertise locale',
    desc: 'Nos analystes basés au Bénin évaluent la pertinence de chaque projet sur le marché ouest-africain.',
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774608849/te_tenihd.jpg',
    color: 'from-green-500/20 to-green-600/5',
    iconColor: 'text-green-500',
  },
  {
    num: '03',
    icon: Eye,
    title: 'Transparence totale',
    desc: "Chaque investisseur dispose d'un tableau de bord pour suivre en temps réel l'évolution de ses placements.",
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774608852/im_evrurs.jpg',
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-500',
  },
];

export default function HomeContent() {
  return (
    <main className="flex flex-col font-sans bg-bg text-white overflow-x-hidden max-w-full">
      <Hero />

      {/* EXPERTISE */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <Sparkles size={14} className="text-green-500" />
              <span className="text-xs uppercase tracking-wider text-green-500 font-semibold">Notre méthodologie</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Un audit{' '}
              <span className="text-green-500">rigoureux</span>
              <br />à chaque étape
            </h2>
            <p className="text-text-2 max-w-2xl mx-auto text-sm md:text-base">
              Notre processus en trois étapes garantit la qualité et la sécurité de chaque investissement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {expertise.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.num} className={`group bg-gradient-to-br ${item.color} rounded-2xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2`}>
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="text-5xl font-black text-white/80" style={{ fontFamily: 'Georgia, serif' }}>
                        {item.num}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon size={20} className="text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-text-2 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/5 to-transparent blur-xl" />
            <div className="relative p-8 md:p-12 rounded-3xl border border-green-500/10 bg-surface/50 backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Globe size={24} className="text-green-500" />
                </div>
              </div>
              <p className="text-center text-white text-lg md:text-xl leading-relaxed font-light italic" style={{ fontFamily: 'Georgia, serif' }}>
                "Bâtir un écosystème où le capital rencontre l&apos;innovation pour transformer durablement l&apos;économie du continent africain."
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-16 h-px bg-green-500/30" />
              </div>
              <div className="mt-6 text-center">
                <Link href="/projets" className="inline-flex items-center gap-2 text-green-500 text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all group">
                  Découvrir les opportunités
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
