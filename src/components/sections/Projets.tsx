'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { getProjects } from '@/services/api';

type Secteur = 'tous' | 'tech' | 'agriculture' | 'immobilier' | 'energie' | 'sante';

interface Projet {
  id: number;
  titre: string;
  secteur: string;
  montant_cible: number;
  localisation: string;
  description: string;
  progression: number;
  montant_actuel: number;
  porteur: string;
}

const secteurs: { value: Secteur; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'tech', label: 'Tech' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'energie', label: 'Énergie' },
  { value: 'sante', label: 'Santé' },
];

export default function Projets() {
  const [secteurActif, setSecteurActif] = useState<Secteur>('tous');
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects();
      setProjets(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors du chargement des projets:', err);
      if (err.response?.status === 403) {
        setError('Votre compte est en attente de validation par un administrateur.');
      } else {
        setError('Impossible de charger les projets. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const projetsFiltres =
    secteurActif === 'tous'
      ? projets
      : projets.filter((p) => p.secteur === secteurActif);

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  if (loading) {
    return (
      <section className="py-32 bg-bg">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-text-2 font-dm">Chargement des projets...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32 bg-bg">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-red-500 font-dm">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProjects}>
            Réessayer
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-bg">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair text-gold mb-4">
            Projets à financer
          </h2>
          <p className="text-text-2 font-dm max-w-2xl mx-auto">
            Découvrez des opportunités d'investissement dans des secteurs porteurs en Afrique francophone.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {secteurs.map((secteur) => (
            <button
              key={secteur.value}
              onClick={() => setSecteurActif(secteur.value)}
              className={`px-6 py-2.5 rounded-full font-syne text-sm transition-all duration-300 hover:scale-105 ${
                secteurActif === secteur.value
                  ? 'bg-gold text-surface font-semibold shadow-lg'
                  : 'bg-surface-2 text-text-2 hover:bg-gold/20 hover:text-gold'
              }`}
            >
              {secteur.label}
            </button>
          ))}
        </div>

        {projetsFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-2 font-dm">
              Aucun projet dans ce secteur pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projetsFiltres.map((projet) => (
              <div
                key={projet.id}
                className="group bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-52 bg-gradient-to-br from-gold/40 to-violet-2/40 flex items-center justify-center relative">
                  <span className="text-surface-2 font-syne text-sm">Image projet</span>
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-playfair text-gold group-hover:text-gold/90 transition">
                      {projet.titre}
                    </h3>
                    <span className="text-xs font-syne bg-gold/20 text-gold px-3 py-1 rounded-full">
                      {projet.secteur}
                    </span>
                  </div>
                  <p className="text-text-2 font-dm text-sm mb-5 leading-relaxed line-clamp-3">
                    {projet.description}
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-text-2 mb-1">
                      <span>Progression</span>
                      <span>{projet.progression}%</span>
                    </div>
                    <div className="w-full bg-surface-2 rounded-full h-2">
                      <div
                        className="bg-gold rounded-full h-2 transition-all duration-500"
                        style={{ width: `${projet.progression}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-5">
                    <span className="text-gold font-syne font-semibold text-base">
                      {formatMontant(projet.montant_actuel)} / {formatMontant(projet.montant_cible)}
                    </span>
                    <span className="text-text-2 font-dm">{projet.localisation}</span>
                  </div>
                  <Button variant="outline" size="md" className="w-full py-3">
                    Voir le projet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button variant="gold" size="lg" className="px-8 py-4 text-lg">
            Proposer mon projet
          </Button>
        </div>
      </div>
    </section>
  );
}
