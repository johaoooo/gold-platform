'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyInvestments } from '@/services/api';
import DashboardTabs from '@/components/dashboard/DashboardTabs';

interface Investment {
  id: number;
  projet: string;
  montant: number;
  statut: string;
  date: string;
  message: string;
}

export default function MesInvestissementsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await getMyInvestments();
      setInvestments(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'accepte': return 'text-green-500 bg-green-500/10';
      case 'en_attente': return 'text-yellow-500 bg-yellow-500/10';
      case 'refuse': return 'text-red-500 bg-red-500/10';
      default: return 'text-text-2 bg-surface-2';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'accepte': return 'Accepté';
      case 'en_attente': return 'En attente';
      case 'refuse': return 'Refusé';
      default: return statut;
    }
  };

  if (loading) {
    return <p className="text-text-2">Chargement de vos investissements...</p>;
  }

  return (
    <div>
      <DashboardTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">Mes investissements</h1>
      <p className="text-text-2 mb-6">Suivez l'état de vos investissements</p>

      {investments.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center border border-gold/20">
          <p className="text-text-2 mb-4">Vous n'avez pas encore d'investissements.</p>
          <Link
            href="/dashboard/investisseur/projets"
            className="inline-block px-6 py-3 bg-gold text-bg rounded-lg hover:bg-gold-light transition-all"
          >
            Explorer les projets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-surface rounded-xl p-6 border border-gold/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-playfair text-gold">{inv.projet}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-syne ${getStatusColor(inv.statut)}`}>
                  {getStatusLabel(inv.statut)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gold font-semibold">{formatMontant(inv.montant)}</span>
                <span className="text-text-2">{formatDate(inv.date)}</span>
              </div>
              {inv.message && (
                <p className="text-text-2 text-sm mt-2 pt-2 border-t border-gold/10">
                  💬 {inv.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
