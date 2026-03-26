'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProject, createInvestment } from '@/services/api';
import Button from '@/components/ui/Button';

interface Project {
  id: number;
  titre: string;
  description: string;
  secteur: string;
  localisation: string;
  montant_cible: number;
  montant_actuel: number;
  progression: number;
  statut: string;
  porteur: string;
  date_limite: string | null;
}

export default function ProjetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showInvestForm, setShowInvestForm] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investMessage, setInvestMessage] = useState('');
  const [investing, setInvesting] = useState(false);
  const [investError, setInvestError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await getProject(Number(id));
      setProject(response.data);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError('Projet introuvable');
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestError('');
    setInvesting(true);

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      setInvestError('Veuillez entrer un montant valide');
      setInvesting(false);
      return;
    }

    try {
      await createInvestment(Number(id), amount, investMessage);
      toast.success('Votre demande d\'investissement a été envoyée au porteur du projet !');
      setShowInvestForm(false);
      setInvestAmount('');
      setInvestMessage('');
      fetchProject(); // Rafraîchir les données
    } catch (err: any) {
      console.error('Erreur:', err);
      setInvestError(err.response?.data?.error || 'Erreur lors de la demande');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-28">
        <p className="text-text-2">Chargement du projet...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Projet introuvable'}</p>
          <Link href="/" className="text-gold hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const isInvestisseur = user?.role === 'investisseur';
  const isPorteur = user?.role === 'porteur';
  const isOwner = isPorteur && project.porteur?.includes(user?.username);
  const isOpen = project.statut === 'ouvert';

  return (
    <div className="min-h-screen bg-bg pt-28">
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <Link href="/" className="text-text-2 hover:text-gold text-sm transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>

        {/* En-tête */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl md:text-5xl font-playfair text-gold">
            {project.titre}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-syne ${
            project.statut === 'ouvert' 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {project.statut === 'ouvert' ? 'Ouvert' : 'Fermé'}
          </span>
        </div>

        {/* Infos de base */}
        <div className="flex flex-wrap gap-4 mb-8 text-text-2">
          <span>📁 {project.secteur}</span>
          <span>📍 {project.localisation}</span>
          <span>👤 Porteur : {project.porteur}</span>
          {project.date_limite && (
            <span>📅 Limite : {new Date(project.date_limite).toLocaleDateString('fr-FR')}</span>
          )}
        </div>

        {/* Description */}
        <div className="bg-surface rounded-xl p-6 border border-gold/20 mb-8">
          <h2 className="text-2xl font-playfair text-gold mb-4">Description</h2>
          <p className="text-text-2 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {/* Progression */}
        <div className="bg-surface rounded-xl p-6 border border-gold/20 mb-8">
          <h2 className="text-2xl font-playfair text-gold mb-4">Progression</h2>
          <div className="flex justify-between text-text-2 mb-2">
            <span>Collecté : {formatMontant(project.montant_actuel)}</span>
            <span>Objectif : {formatMontant(project.montant_cible)}</span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-4">
            <div
              className="bg-gold rounded-full h-4 transition-all duration-500"
              style={{ width: `${project.progression}%` }}
            />
          </div>
          <p className="text-text-2 text-sm mt-2 text-center">
            {project.progression}% du financement atteint
          </p>
        </div>

        {/* Bouton d'investissement */}
        {isInvestisseur && isOpen && (
          <div className="text-center">
            {!showInvestForm ? (
              <Button
                variant="gold"
                size="lg"
                onClick={() => setShowInvestForm(true)}
                className="px-8 py-4 text-lg"
              >
                💰 Investir dans ce projet
              </Button>
            ) : (
              <div className="bg-surface rounded-xl p-6 border border-gold/20 max-w-md mx-auto">
                <h3 className="text-xl font-playfair text-gold mb-4">Proposer un investissement</h3>
                <form onSubmit={handleInvest} className="space-y-4">
                  {investError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
                      {investError}
                    </div>
                  )}
                  <div>
                    <label className="block text-text-2 font-dm mb-2">Montant (FCFA) *</label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="ex: 1000000"
                      className="w-full px-4 py-3 bg-bg border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-text-2 font-dm mb-2">Message (optionnel)</label>
                    <textarea
                      value={investMessage}
                      onChange={(e) => setInvestMessage(e.target.value)}
                      rows={3}
                      placeholder="Pourquoi voulez-vous investir dans ce projet ?"
                      className="w-full px-4 py-3 bg-bg border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="gold" disabled={investing} className="flex-1">
                      {investing ? 'Envoi...' : 'Envoyer la demande'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInvestForm(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Message pour porteur */}
        {isPorteur && (
          <div className="text-center">
            {isOwner ? (
              <Link
                href={`/dashboard/porteur/projets/${project.id}`}
                className="inline-block px-6 py-3 bg-gold text-bg rounded-lg hover:bg-gold-light transition-all"
              >
                📊 Gérer ce projet
              </Link>
            ) : (
              <p className="text-text-2">Vous êtes porteur de projet. Créez vos propres projets !</p>
            )}
          </div>
        )}

        {/* Message si projet fermé */}
        {!isOpen && (
          <div className="text-center">
            <p className="text-text-2">Ce projet n'est plus ouvert aux investissements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
