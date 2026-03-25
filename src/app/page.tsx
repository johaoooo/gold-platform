'use client';

import Image from 'next/image';
import Link from 'next/link';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl md:text-3xl font-bold text-gold" style={{ fontFamily: 'Georgia, serif' }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/40 text-center">{label}</span>
    </div>
  );
}

const projects = [
  {
    id: 1,
    title: 'Agropole de Parakou',
    sector: 'Agriculture',
    return: '+18%',
    img: '/images/generated-project1.jpg',
    desc: "Développement d'une filière d'exportation de produits agricoles transformés vers l'Europe.",
  },
  {
    id: 2,
    title: 'Énergie Solaire Sahel',
    sector: 'Énergie',
    return: '+22%',
    img: '/images/generated-project2.jpg',
    desc: 'Installation de micro-centrales solaires dans les zones rurales du nord Bénin.',
  },
  {
    id: 3,
    title: 'Logistique Côtière',
    sector: 'Transport',
    return: '+15%',
    img: '/images/generated-project3.jpg',
    desc: "Modernisation des infrastructures portuaires pour fluidifier le commerce régional en Afrique de l'Ouest.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col font-sans bg-bg text-white overflow-x-hidden max-w-full">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="Golden Invest" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-bg" />
        </div>

        {/* Grille décorative via CSS variable */}
        <div className="absolute inset-0 z-[1] opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.15] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            L&apos;investissement{' '}
            <span className="text-transparent bg-clip-text block sm:inline" style={{
              backgroundImage: 'linear-gradient(90deg, var(--color-gold-glow), var(--color-gold))'
            }}>
              stratégique
            </span>
            {' '}en Afrique
          </h1>

          <p className="mt-6 text-white/50 max-w-lg mx-auto text-sm md:text-lg leading-relaxed">
            Golden Invest connecte les porteurs de projets innovants aux investisseurs visionnaires pour bâtir l&apos;économie de demain.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none mx-auto">
            <Link href="/deposer">
              <button className="w-full sm:w-auto px-8 py-4 text-[12px] md:text-sm font-semibold uppercase tracking-wider rounded-full text-white transition-all duration-300 hover:scale-105 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))' }}>
                Proposer un projet
              </button>
            </Link>
            <Link href="/projets">
              <button className="w-full sm:w-auto px-8 py-4 text-[12px] md:text-sm font-semibold uppercase tracking-wider rounded-full border border-white/10 text-white/70 hover:border-gold/40 hover:text-white transition-all duration-300">
                Voir les opportunités
              </button>
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 md:gap-12 border-t border-white/5 pt-10 w-full">
            <Stat value="120+" label="Projets financés" />
            <Stat value="4,2 Mrd" label="FCFA investis" />
            <Stat value="18%" label="Rendement moyen" />
            <Stat value="98%" label="Taux de satisfaction" />
          </div>
        </div>
      </section>

      {/* PROJETS EN VEDETTE */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">Opportunités sélectionnées</span>
            <h2 className="text-3xl md:text-4xl font-bold text-center" style={{ fontFamily: 'Georgia, serif' }}>Projets en vedette</h2>
            <div className="mt-4 w-16 h-px bg-gold/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link key={p.id} href={`/projets/project${p.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all duration-500">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-gold/20 backdrop-blur-sm border border-gold/30 text-white text-xs font-bold px-3 py-1 rounded-full">{p.return} / an</div>
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm border border-white/10 text-white/60 text-xs px-3 py-1 rounded-full">{p.sector}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-gold transition-colors">{p.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex items-center gap-1 text-gold text-xs font-semibold uppercase tracking-wider">
                      <span>Voir le projet</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              {[
                { num: '01', title: 'Sécurité des actifs', desc: 'Standards bancaires pour la protection de vos données et le suivi des transactions financières.' },
                { num: '02', title: 'Expertise locale', desc: 'Nos analystes basés au Bénin évaluent la pertinence de chaque projet sur le marché ouest-africain.' },
                { num: '03', title: 'Transparence totale', desc: "Chaque investisseur dispose d'un tableau de bord pour suivre en temps réel l'évolution de ses placements." },
              ].map((item) => (
                <div key={item.num} className="flex gap-5">
                  <span className="text-xl font-bold shrink-0 mt-0.5 text-gold/50" style={{ fontFamily: 'Georgia, serif' }}>{item.num}</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
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
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}