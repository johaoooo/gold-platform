'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '@/services/api';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ProjectCardSkeleton, DashboardStatsSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { TrendingUp, Briefcase, Wallet, ArrowRight, MapPin, BarChart2 } from 'lucide-react';

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

export default function InvestisseurDashboard() {
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
      setProjects(response.data.slice(0, 3));
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
      <div>
        <DashboardTabs />
        <div className="animate-fade-in">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96 mb-8" />
          <DashboardStatsSkeleton />
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <ProjectCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Projets disponibles',
      value: projects.length,
      icon: <Briefcase size={20} className="text-gold" />,
    },
    {
      label: 'Mes investissements',
      value: '0',
      icon: <TrendingUp size={20} className="text-gold" />,
    },
    {
      label: 'Portefeuille',
      value: '0 FCFA',
      icon: <Wallet size={20} className="text-gold" />,
    },
  ];

  return (
    <div className="space-y-10">
      <DashboardTabs />

      <div>
        <h1 className="text-3xl font-playfair text-gold mb-1">Tableau de bord</h1>
        <p className="text-text-2 text-sm">
          Bienvenue{user?.username ? `, ${user.username}` : ''} sur votre espace investisseur 👋
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

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-playfair text-gold">Projets récents</h2>
          <Link
            href="/projets"
            className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-all"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-surface rounded-2xl p-5 border border-gold/15 hover:border-gold/40 transition-all duration-300 flex flex-col gap-4 group"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold/50 font-semibold">
                  {project.secteur}
                </span>
                <h3 className="text-lg font-playfair text-gold mt-1 group-hover:text-gold/80 transition-colors line-clamp-1">
                  {project.titre}
                </h3>
                <p className="text-text-2 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
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
    </div>
  );
}
