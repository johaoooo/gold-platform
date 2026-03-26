'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe, Monitor, Wheat, Building2, Zap,
  MapPin, User, TrendingUp, ArrowRight, Plus, Loader2
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
  { value: 'tous',        label: 'Tous',        icon: Globe      },
  { value: 'tech',        label: 'Tech',        icon: Monitor    },
  { value: 'agriculture', label: 'Agriculture', icon: Wheat      },
  { value: 'immobilier',  label: 'Immobilier',  icon: Building2  },
  { value: 'energie',     label: 'Énergie',     icon: Zap        },
];

const getSecteurColor = (secteur: string) => {
  const colors: Record<string, string> = {
    tech:        'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    agriculture: 'from-green-500/10 to-green-600/5 border-green-500/20',
    immobilier:  'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    energie:     'from-gold/10 to-gold/5 border-gold/20',
  };
  return colors[secteur] || 'from-gold/10 to-gold/5 border-gold/20';
};

const formatMontant = (montant: number) =>
  new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';

export default function Projets() {
  const router = useRouter();
  const [secteurActif, setSecteurActif] = useState('tous');
  const [projets, setProjets]           = useState<Project[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [userRole, setUserRole]         = useState<string | null>(null);

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
      <section className="py-32 bg-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-2">
          <Loader2 size={20} className="animate-spin text-gold" />
          <span className="text-sm uppercase tracking-widest">Chargement des projets...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* EN-TÊTE */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4 block">Opportunités vérifiées</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            <span class="text-white">Projets à </span><span class="text-gold">financer</span>
          </h2>
          <p className="text-text-2 max-w-2xl mx-auto text-sm">
            Découvrez des opportunités d&apos;investissement dans des secteurs porteurs d&apos;Afrique.
          </p>

          {/* Bannière non connecté */}
          {!isLoggedIn && (
            <div className="mt-6 inline-flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-full px-5 py-2.5">
              <span className="text-gold/80 text-xs">Connectez-vous pour investir dans ces projets</span>
              <Link href="/connexion" className="text-xs font-bold text-gold hover:underline flex items-center gap-1">
                Se connecter <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* FILTRES */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {secteurs.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                onClick={() => setSecteurActif(s.value)}
                className={`px-5 py-2.5 rounded-full font-syne text-sm transition-all duration-300 flex items-center gap-2 ${
                  secteurActif === s.value
                    ? 'bg-gold text-white font-semibold shadow-lg scale-105'
                    : 'bg-surface text-text-2 hover:bg-gold/10 hover:text-gold border border-white/5 hover:border-gold/30'
                }`}
              >
                <Icon size={14} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* GRILLE PROJETS */}
        {projetsFiltres.length === 0 ? (
          <div className="text-center py-20 text-text-2">
            <Building2 size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Aucun projet dans ce secteur pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projetsFiltres.map((projet) => (
              <div
                key={projet.id}
                className={`group bg-gradient-to-br ${getSecteurColor(projet.secteur)} rounded-2xl overflow-hidden border hover:shadow-xl hover:-translate-y-2 transition-all duration-500`}
              >
                {/* Image secteur */}
                <div className="relative h-44 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <div
                    className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(/images/projects/${projet.secteur.toLowerCase()}.jpg)` }}
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-3 py-1 bg-gold/90 text-white text-[10px] font-syne font-bold rounded-full uppercase tracking-wider">
                      {projet.secteur}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-white/70 text-xs">
                    <MapPin size={12} />
                    {projet.localisation}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    {projet.titre}
                  </h3>
                  <p className="text-text-2 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {projet.description}
                  </p>

                  {/* Montant cible */}
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gold font-bold">{formatMontant(projet.montant_cible)}</span>
                    <span className="flex items-center gap-1 text-text-2 text-xs">
                      <TrendingUp size={12} className="text-gold" />
                      {formatMontant(projet.montant_actuel)} collectés
                    </span>
                  </div>

                  {/* Barre progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-text-2 mb-1">
                      <span>Progression</span>
                      <span className="text-gold font-semibold">{projet.progression}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-gold to-gold-light rounded-full h-1.5 transition-all duration-1000"
                        style={{ width: `${Math.min(projet.progression, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Porteur */}
                  <div className="flex items-center gap-1.5 text-xs text-text-2 mb-4">
                    <User size={12} />
                    <span>{projet.porteur}</span>
                  </div>

                  {/* CTA */}
                  {isLoggedIn ? (
                    <Link href={`/projets/${projet.id}`}>
                      <Button variant="outline" size="md" className="w-full group-hover:bg-gold group-hover:text-white transition-all duration-300">
                        <span className="flex items-center justify-center gap-2">
                          Voir le projet <ArrowRight size={14} />
                        </span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/connexion">
                      <Button variant="outline" size="md" className="w-full hover:bg-gold hover:text-white transition-all duration-300">
                        <span className="flex items-center justify-center gap-2">
                          Connexion pour investir <ArrowRight size={14} />
                        </span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOUTON PROPOSER */}
        <div className="text-center mt-16">
          <button
            onClick={handleProposerProjet}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-syne font-bold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f0a500, #e8861a)' }}
          >
            <Plus size={18} />
            Proposer mon projet
          </button>
          {!isLoggedIn && (
            <p className="mt-3 text-xs text-text-2">
              Vous devez être connecté en tant que porteur pour proposer un projet.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
