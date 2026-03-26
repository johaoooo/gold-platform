'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  { value: 'tous',        label: 'Tous',        icon: Globe,      color: 'text-white' },
  { value: 'tech',        label: 'Tech',        icon: Monitor,    color: 'text-blue-400' },
  { value: 'agriculture', label: 'Agriculture', icon: Wheat,      color: 'text-green-400' },
  { value: 'immobilier',  label: 'Immobilier',  icon: Building2,  color: 'text-purple-400' },
  { value: 'energie',     label: 'Énergie',     icon: Zap,        color: 'text-yellow-400' },
];

const getSecteurImage = (secteur: string) => {
  const images: Record<string, string> = {
    tech: '/images/projects/tech.jpg',
    agriculture: '/images/projects/agriculture.jpg',
    immobilier: '/images/projects/immobilier.jpg',
    energie: '/images/projects/energie.jpg',
  };
  return images[secteur] || '/images/projects/agriculture.jpg';
};

const getSecteurColor = (secteur: string) => {
  const colors: Record<string, string> = {
    tech: 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50',
    agriculture: 'border-green-500/30 bg-green-500/5 hover:border-green-500/50',
    immobilier: 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50',
    energie: 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50',
  };
  return colors[secteur] || 'border-green-500/30 bg-green-500/5 hover:border-green-500/50';
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
        <div className="flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-green-500" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/60 mb-4 block">Opportunités vérifiées</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Projets à <span className="text-green-500">financer</span>
          </h2>
          <p className="text-text-2 max-w-2xl mx-auto text-sm">
            Découvrez des opportunités d'investissement dans des secteurs porteurs d'Afrique.
          </p>

          {!isLoggedIn && (
            <div className="mt-6 inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2.5">
              <span className="text-green-500/80 text-xs">Connectez-vous pour investir dans ces projets</span>
              <Link href="/connexion" className="text-xs font-bold text-green-500 hover:underline flex items-center gap-1">
                Se connecter <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {secteurs.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                onClick={() => setSecteurActif(s.value)}
                className={`px-5 py-2.5 rounded-full font-syne text-sm transition-all duration-300 flex items-center gap-2 ${
                  secteurActif === s.value
                    ? 'bg-green-500 text-white font-semibold shadow-lg scale-105'
                    : 'bg-surface text-text-2 hover:bg-green-500/10 hover:text-green-500 border border-white/5 hover:border-green-500/30'
                }`}
              >
                <Icon size={14} className={secteurActif === s.value ? 'text-white' : s.color} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Grille projets */}
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
                className={`group ${getSecteurColor(projet.secteur)} rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl bg-surface`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={getSecteurImage(projet.secteur)}
                    alt={projet.titre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-3 py-1 bg-green-500/90 text-white text-[10px] font-syne font-bold rounded-full uppercase tracking-wider">
                      {projet.secteur}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 text-white/80 text-xs bg-black/50 px-2 py-1 rounded-full">
                      <MapPin size={12} />
                      {projet.localisation}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    {projet.titre}
                  </h3>
                  <p className="text-text-2 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {projet.description}
                  </p>

                  {/* Montants */}
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-green-500 font-bold">{formatMontant(projet.montant_cible)}</span>
                    <span className="flex items-center gap-1 text-text-2 text-xs">
                      <TrendingUp size={12} className="text-green-500" />
                      {formatMontant(projet.montant_actuel)} collectés
                    </span>
                  </div>

                  {/* Progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-text-2 mb-1">
                      <span>Progression</span>
                      <span className="text-green-500 font-semibold">{projet.progression}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 rounded-full h-1.5 transition-all duration-1000"
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
                      <Button variant="outline" size="md" className="w-full group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                        <span className="flex items-center justify-center gap-2">
                          Voir le projet <ArrowRight size={14} />
                        </span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/connexion">
                      <Button variant="outline" size="md" className="w-full hover:bg-green-500 hover:text-white transition-all duration-300">
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

        {/* Bouton proposer */}
        <div className="text-center mt-12">
          <button
            onClick={handleProposerProjet}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-syne font-bold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 bg-green-500 hover:bg-green-600"
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
