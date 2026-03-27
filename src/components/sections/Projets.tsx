'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Globe, Monitor, Wheat, Building2, Zap,
  MapPin, User, TrendingUp, ArrowRight, Plus, Loader2, ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import { getProjects } from '@/lib/api';

interface Project {
  id: number;
  titre: string;
  secteur: string;
  montant_cible: number;
  montant_actuel: number;
  localisation: string;
  progression: number;
  description: string;
  porteur: string;
}

const secteurs = [
  { value: 'tous',        label: 'Tous',        icon: Globe,     color: 'text-white' },
  { value: 'tech',        label: 'Tech',        icon: Monitor,   color: 'text-blue-400' },
  { value: 'agriculture', label: 'Agriculture', icon: Wheat,     color: 'text-green-400' },
  { value: 'immobilier',  label: 'Immobilier',  icon: Building2, color: 'text-purple-400' },
  { value: 'energie',     label: 'Énergie',     icon: Zap,       color: 'text-yellow-400' },
];

const getSecteurImage = (secteur: string) => {
  const images: Record<string, string> = {
    tech:        '/images/projects/tech.jpg',
    agriculture: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774566701/agriculture_lb5g2b.jpg',
    immobilier:  'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774566702/immobilier_ypcaur.jpg',
    energie:     'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774566701/energie_pivryt.jpg',
  };
  return images[secteur] || 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1774566701/agriculture_lb5g2b.jpg';
};

const getSecteurStyle = (secteur: string) => {
  const styles: Record<string, { border: string; badge: string; glow: string; accent: string }> = {
    tech:        { border: 'border-blue-500/25 hover:border-blue-500/50',     badge: 'bg-blue-500/90',   glow: 'hover:shadow-blue-500/15',   accent: 'from-blue-900/40' },
    agriculture: { border: 'border-green-500/25 hover:border-green-500/50',   badge: 'bg-green-500/90',  glow: 'hover:shadow-green-500/15',  accent: 'from-green-900/40' },
    immobilier:  { border: 'border-purple-500/25 hover:border-purple-500/50', badge: 'bg-purple-500/90', glow: 'hover:shadow-purple-500/15', accent: 'from-purple-900/40' },
    energie:     { border: 'border-yellow-500/25 hover:border-yellow-500/50', badge: 'bg-yellow-500/90', glow: 'hover:shadow-yellow-500/15', accent: 'from-yellow-900/40' },
  };
  return styles[secteur] || styles['agriculture'];
};

const formatMontant = (montant: number) =>
  new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';

export default function Projets() {
  const router = useRouter();
  const [secteurActif, setSecteurActif] = useState('tous');
  const [projets, setProjets] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserRole(u.role);
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjets(Array.isArray(data) ? data : data.results ?? []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposerProjet = () => {
    if (!isLoggedIn) {
      router.push('/connexion');
      return;
    }
    if (userRole === 'porteur') {
      router.push('/dashboard/porteur/nouveau-projet');
    } else {
      alert('Seuls les porteurs de projet peuvent proposer un projet.');
    }
  };

  const projetsFiltres = secteurActif === 'tous'
    ? projets
    : projets.filter((p) => p.secteur.toLowerCase() === secteurActif);

  if (loading) {
    return (
      <section className="py-20 bg-bg">
        <div className="flex items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-green-500" />
          <span className="text-text-2 text-sm">Chargement des projets…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-bg relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">

        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.4em] text-green-500/70 mb-5 font-medium">
            ✦ Opportunités vérifiées ✦
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Projets à{' '}
            <span className="relative inline-block">
              <span className="text-green-500">financer</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
            </span>
          </h2>
          <p className="text-text-2 max-w-2xl mx-auto text-sm leading-relaxed">
            Découvrez des opportunités d&apos;investissement dans des secteurs porteurs d&apos;Afrique.
          </p>

          {!isLoggedIn && (
            <div className="mt-8 inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500/80 text-xs">Connectez-vous pour investir dans ces projets</span>
              <Link href="/connexion" className="text-xs font-bold text-green-500 hover:underline flex items-center gap-1">
                Se connecter <ChevronRight size={12} />
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {secteurs.map((s) => {
            const Icon = s.icon;
            const isActive = secteurActif === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setSecteurActif(s.value)}
                className={`px-5 py-2.5 rounded-full font-syne text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-green-500 text-white font-semibold shadow-lg shadow-green-500/30 scale-105'
                    : 'bg-surface text-text-2 hover:bg-green-500/10 hover:text-green-500 border border-white/5 hover:border-green-500/30'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : s.color} />
                {s.label}
              </button>
            );
          })}
        </div>

        {projetsFiltres.length === 0 ? (
          <div className="text-center py-20 text-text-2">
            <Building2 size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Aucun projet dans ce secteur pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projetsFiltres.map((projet) => {
              const style = getSecteurStyle(projet.secteur.toLowerCase());
              const pct = Math.min(projet.progression, 100);

              return (
                <div
                  key={projet.id}
                  className={`group bg-surface rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${style.border} ${style.glow}`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={getSecteurImage(projet.secteur.toLowerCase())}
                      alt={projet.titre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${style.accent} to-transparent opacity-50`} />

                    <div className="absolute top-3 left-3 z-10">
                      <span className={`${style.badge} text-white text-[10px] font-syne font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm`}>
                        {projet.secteur}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1 text-white/90 text-[10px] bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <MapPin size={10} />
                        {projet.localisation}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                      {projet.titre}
                    </h3>
                    <p className="text-text-2 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {projet.description}
                    </p>

                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-[10px] text-text-2 uppercase tracking-wider mb-0.5">Objectif</p>
                        <p className="text-green-500 font-bold text-sm">{formatMontant(projet.montant_cible)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-text-2 uppercase tracking-wider mb-0.5">Collecté</p>
                        <p className="text-white font-semibold text-sm flex items-center gap-1 justify-end">
                          <TrendingUp size={11} className="text-green-500" />
                          {formatMontant(projet.montant_actuel)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-text-2 mb-1.5">
                        <span>Progression</span>
                        <span className="text-green-500 font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-full h-1.5 transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-text-2 mb-4 pb-4 border-b border-white/5">
                      <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                        <User size={11} className="text-green-500" />
                      </div>
                      <span>{projet.porteur}</span>
                    </div>

                    {isLoggedIn ? (
                      <Link href={`/projets/${projet.id}`}>
                        <Button variant="outline" size="md" className="w-full group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all duration-300">
                          <span className="flex items-center justify-center gap-2">
                            Voir le projet <ArrowRight size={14} />
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/connexion">
                        <Button variant="outline" size="md" className="w-full hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300">
                          <span className="flex items-center justify-center gap-2">
                            Connexion pour investir <ArrowRight size={14} />
                          </span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={handleProposerProjet}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-syne font-bold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25"
          >
            <Plus size={18} />
            Proposer mon projet
          </button>
          {!isLoggedIn && (
            <p className="mt-3 text-xs text-text-2 opacity-60">
              Vous devez être connecté en tant que porteur pour proposer un projet.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
