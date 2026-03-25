'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/services/api';
import PorteurTabs from '@/components/dashboard/PorteurTabs';

interface Project {
  id: number;
  titre: string;
  secteur: string;
  montant_cible: number;
  montant_actuel: number;
  localisation: string;
  progression: number;
  description: string;
  statut: string;
}

export default function MesProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      // Filtrer les projets du porteur connecté
      const myProjects = response.data.filter((p: any) => 
        p.porteur?.includes(user?.username)
      );
      setProjects(myProjects);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  if (loading) {
    return <p className="text-text-2">Chargement de vos projets...</p>;
  }

  return (
    <div>
      <PorteurTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">Mes projets</h1>
      <p className="text-text-2 mb-6">Gérez vos projets et suivez leur progression</p>

      {projects.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center border border-gold/20">
          <p className="text-text-2 mb-4">Vous n'avez pas encore de projets.</p>
          <Link
            href="/dashboard/porteur/nouveau-projet"
            className="inline-block px-6 py-3 bg-gold text-bg rounded-lg hover:bg-gold-light transition-all"
          >
            Créer mon premier projet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-surface rounded-xl p-6 border border-gold/20 hover:border-gold transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-playfair text-gold">{project.titre}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.statut === 'ouvert' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {project.statut === 'ouvert' ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
              <p className="text-text-2 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-text-2">{project.secteur}</span>
                <span className="text-text-2">{project.localisation}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gold font-semibold">{formatMontant(project.montant_cible)}</span>
                <span className="text-text-2">Collecté: {formatMontant(project.montant_actuel)}</span>
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
                Gérer le projet
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
