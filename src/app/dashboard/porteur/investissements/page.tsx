'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PorteurTabs from '@/components/dashboard/PorteurTabs';

// TODO: Créer un endpoint API pour récupérer les investissements reçus par le porteur
interface ReceivedInvestment {
  id: number;
  projet_titre: string;
  investisseur: string;
  montant: number;
  statut: string;
  date: string;
  message: string;
}

export default function InvestissementsRecusPage() {
  const [investments, setInvestments] = useState<ReceivedInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Appeler l'API getReceivedInvestments()
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      // Simulation de données
      setInvestments([
        {
          id: 1,
          projet_titre: 'AgriTech Bénin',
          investisseur: 'invest_ouattara',
          montant: 5000000,
          statut: 'accepte',
          date: '2026-03-25',
          message: 'Je crois au potentiel de l\'agriculture connectée.'
        },
        {
          id: 2,
          projet_titre: 'AgriTech Bénin',
          investisseur: 'invest_diop',
          montant: 7500000,
          statut: 'accepte',
          date: '2026-03-24',
          message: 'Excellent projet, je souhaite contribuer.'
        },
        {
          id: 3,
          projet_titre: 'SolarHub Sénégal',
          investisseur: 'invest_nguyen',
          montant: 35000000,
          statut: 'en_attente',
          date: '2026-03-25',
          message: 'Très bon modèle d\'affaires.'
        }
      ]);
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

  const handleAccept = (id: number) => {
    // TODO: Appeler l'API acceptInvestment()
    alert(`Investissement ${id} accepté !`);
  };

  const handleReject = (id: number) => {
    // TODO: Appeler l'API rejectInvestment()
    alert(`Investissement ${id} refusé.`);
  };

  if (loading) {
    return <p className="text-text-2">Chargement des investissements...</p>;
  }

  return (
    <div>
      <PorteurTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">Investissements reçus</h1>
      <p className="text-text-2 mb-6">Gérez les demandes d'investissement sur vos projets</p>

      {investments.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center border border-gold/20">
          <p className="text-text-2 mb-4">Aucun investissement reçu pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-surface rounded-xl p-6 border border-gold/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-playfair text-gold">{inv.projet_titre}</h3>
                  <p className="text-text-2 text-sm">Par {inv.investisseur}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-syne ${getStatusColor(inv.statut)}`}>
                  {getStatusLabel(inv.statut)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gold font-semibold">{formatMontant(inv.montant)}</span>
                <span className="text-text-2">{formatDate(inv.date)}</span>
              </div>
              {inv.message && (
                <p className="text-text-2 text-sm mb-4 pt-2 border-t border-gold/10">
                  💬 {inv.message}
                </p>
              )}
              {inv.statut === 'en_attente' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAccept(inv.id)}
                    className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleReject(inv.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
