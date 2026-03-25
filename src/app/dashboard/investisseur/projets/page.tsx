'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/services/api';
import DashboardTabs from '@/components/dashboard/DashboardTabs';

interface Project {
  id: number;
  titre: string;
  secteur: string;
  montant_cible: number;
  montant_actuel: number;
  localisation: string;
  progression: number;
  description: string;
}

export default function ExplorerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const secteurs = [
    { value: 'tous', label: 'Tous' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'energie', label: 'Énergie' },
    { value: 'immobilier', label: 'Immobilier' },
    { value: 'tech', label: 'Tech' },
  ];

  const projetsFiltres = filter === 'tous'
    ? projects
    : projects.filter(p => p.secteur === filter);

  if (loading) {
    return <p className="text-text-2">Chargement des projets...</p>;
  }

  return (
    <div>
      <DashboardTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">Explorer les projets</h1>
      <p className="text-text-2 mb-6">Découvrez les opportunités d'investissement</p>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-8">
        {secteurs.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-syne transition-all ${
              filter === s.value
                ? 'bg-gold text-bg'
                : 'bg-surface-2 text-text-2 hover:bg-gold/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Grille des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetsFiltres.map((project) => (
          <div key={project.id} className="bg-surface rounded-xl p-6 border border-gold/20 hover:border-gold transition-all">
            <h3 className="text-xl font-playfair text-gold mb-2">{project.titre}</h3>
            <p className="text-text-2 text-sm mb-3 line-clamp-2">{project.description}</p>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gold font-semibold">{formatMontant(project.montant_cible)}</span>
              <span className="text-text-2">{project.localisation}</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-text-2 mb-1">
                <span>Progression</span>
                <span>{project.progression}%</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-2">
                <div className="bg-gold rounded-full h-2" style={{ width: `${project.progression}%` }} />
              </div>
            </div>
            <Link
              href={`/projets/${project.id}`}
              className="block w-full text-center py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-surface transition-all"
            >
              Voir le projet
            </Link>
          </div>
        ))}
      </div>

      {projetsFiltres.length === 0 && (
        <p className="text-center text-text-2 py-8">Aucun projet dans cette catégorie.</p>
      )}
    </div>
  );
}
