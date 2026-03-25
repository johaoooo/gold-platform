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

export default function PorteurDashboard() {
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
      // Filtrer les projets du porteur connecté (basé sur le nom du porteur)
      const myProjects = response.data.filter((p: any) => 
        p.porteur?.includes(user?.username) || p.porteur?.includes(user?.username)
      );
      setProjects(myProjects.slice(0, 3));
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
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-2">Chargement du dashboard...</p>
      </div>
    );
  }

  const totalInvesti = projects.reduce((sum, p) => sum + p.montant_actuel, 0);
  const totalCible = projects.reduce((sum, p) => sum + p.montant_cible, 0);

  return (
    <div>
      <PorteurTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">
        Tableau de bord porteur
      </h1>
      <p className="text-text-2 mb-8">
        Bienvenue sur votre espace porteur de projet 👋
      </p>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface rounded-xl p-6 border border-gold/20">
          <p className="text-text-2 text-sm mb-1">Mes projets</p>
          <p className="text-3xl font-playfair text-gold">{projects.length}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-gold/20">
          <p className="text-text-2 text-sm mb-1">Total investi</p>
          <p className="text-3xl font-playfair text-gold">{formatMontant(totalInvesti)}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-gold/20">
          <p className="text-text-2 text-sm mb-1">Objectif global</p>
          <p className="text-3xl font-playfair text-gold">{formatMontant(totalCible)}</p>
        </div>
      </div>
      
      {/* Actions rapides */}
      <div className="flex gap-4 mb-10">
        <Link
          href="/dashboard/porteur/nouveau-projet"
          className="px-6 py-3 bg-gold text-bg rounded-lg hover:bg-gold-light transition-all"
        >
          + Nouveau projet
        </Link>
        <Link
          href="/dashboard/porteur/projets"
          className="px-6 py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition-all"
        >
          Voir tous mes projets
        </Link>
      </div>
      
      {/* Projets récents */}
      {projects.length > 0 && (
        <>
          <h2 className="text-2xl font-playfair text-gold mb-6">Mes projets récents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
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
        </>
      )}
    </div>
  );
}
