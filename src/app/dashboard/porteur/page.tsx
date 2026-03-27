'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/services/api';
import PorteurTabs from '@/components/dashboard/PorteurTabs';
import { FolderOpen, TrendingUp, Target, Plus, List, ArrowRight, MapPin, BarChart2 } from 'lucide-react';

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
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
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

  const formatMontant = (montant: number) =>
    new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-2 text-sm animate-pulse">Chargement du dashboard...</p>
      </div>
    );
  }

  const totalInvesti = projects.reduce((sum, p) => sum + p.montant_actuel, 0);
  const totalCible = projects.reduce((sum, p) => sum + p.montant_cible, 0);

  const stats = [
    {
      label: 'Mes projets',
      value: projects.length,
      icon: <FolderOpen size={20} className="text-gold" />,
    },
    {
      label: 'Total investi',
      value: formatMontant(totalInvesti),
      icon: <TrendingUp size={20} className="text-gold" />,
    },
    {
      label: 'Objectif global',
      value: formatMontant(totalCible),
      icon: <Target size={20} className="text-gold" />,
    },
  ];

  const statutColors: Record<string, string> = {
    actif: 'bg-green-500/10 text-green-400',
    en_attente: 'bg-yellow-500/10 text-yellow-400',
    cloture: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="space-y-10">
      <PorteurTabs />

      <div>
        <h1 className="text-3xl font-playfair text-gold mb-1">Tableau de bord porteur</h1>
        <p className="text-text-2 text-sm">
          Bienvenue{user?.username ? `, ${user.username}` : ''} sur votre espace porteur de projet 👋
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl p-6 border border-gold/15 flex items-center gap-4 hover:border-gold/40 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-text-2 text-xs mb-0.5">{stat.label}</p>
              <p className="text-2xl font-playfair text-gold leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/porteur/nouveau-projet"
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-bg text-sm font-semibold rounded-xl hover:bg-gold-light transition-all duration-300"
        >
          <Plus size={16} /> Nouveau projet
        </Link>
        <Link
          href="/dashboard/porteur/projets"
          className="flex items-center gap-2 px-5 py-2.5 border border-gold/30 text-gold text-sm font-semibold rounded-xl hover:bg-gold/10 transition-all duration-300"
        >
          <List size={16} /> Voir tous mes projets
        </Link>
      </div>

      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-playfair text-gold">Mes projets récents</h2>
            <Link
              href="/dashboard/porteur/projets"
              className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-all"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-surface rounded-2xl p-5 border border-gold/15 hover:border-gold/40 transition-all duration-300 flex flex-col gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold/50 font-semibold">
                      {project.secteur}
                    </span>
                    {project.statut && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statutColors[project.statut] || 'bg-gold/10 text-gold'}`}>
                        {project.statut.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-playfair text-gold line-clamp-1">{project.titre}</h3>
                  <p className="text-text-2 text-xs mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold font-semibold">{formatMontant(project.montant_cible)}</span>
                  <span className="flex items-center gap-1 text-text-2">
                    <MapPin size={11} />
                    {project.localisation}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-text-2 mb-1.5">
                    <span className="flex items-center gap-1">
                      <BarChart2 size={11} /> Progression
                    </span>
                    <span className="text-gold font-semibold">{project.progression}%</span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-gold/60 to-gold rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${project.progression}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/projets/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-gold/30 text-gold text-xs font-semibold hover:bg-gold hover:text-surface transition-all duration-300"
                >
                  Voir le projet <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
