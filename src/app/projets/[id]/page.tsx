'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, MapPin, User, Calendar, Target, TrendingUp, 
  DollarSign, BarChart, Clock, AlertCircle, CheckCircle,
  Building2, Eye, Wallet, Award, Percent, PieChart, FileText,
  XCircle, ChevronRight
} from 'lucide-react';
import { getProjectById, createInvestment } from '@/lib/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

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
  date_creation: string;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await getProjectById(Number(id));
      setProject(response);
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

  const formatDate = (date: string) => {
    if (!date) return 'Non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvesting(true);

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      setInvesting(false);
      return;
    }

    try {
      await createInvestment(Number(id), amount, investMessage);
      toast.success('Votre demande d\'investissement a été envoyée !');
      setShowInvestForm(false);
      setInvestAmount('');
      setInvestMessage('');
      fetchProject();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de la demande');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-28">
        <div className="text-center">
          <XCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">{error || 'Projet introuvable'}</p>
          <Link href="/" className="text-green-500 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Retour à l'accueil
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
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Fil d'Ariane */}
        <Link href="/projets" className="inline-flex items-center gap-2 text-text-2 hover:text-green-500 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour aux projets
        </Link>

        {/* En-tête */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {project.titre}
          </h1>
          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
            project.statut === 'ouvert' 
              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            {project.statut === 'ouvert' ? <CheckCircle size={14} /> : <Clock size={14} />}
            {project.statut === 'ouvert' ? 'Ouvert' : 'Fermé'}
          </span>
        </div>

        {/* Infos clés avec icônes pro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/30 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Target size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-text-2">Secteur</p>
              <p className="text-white font-medium">{project.secteur}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/30 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <MapPin size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-text-2">Localisation</p>
              <p className="text-white font-medium">{project.localisation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/30 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <User size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-text-2">Porteur</p>
              <p className="text-white font-medium truncate max-w-[150px]">{project.porteur}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/30 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-text-2">Date limite</p>
              <p className="text-white font-medium">{formatDate(project.date_limite || '')}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 rounded-2xl p-8 border border-white/5 mb-8">
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
            <FileText size={20} className="text-green-500" />
            Description
          </h2>
          <p className="text-text-2 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {/* Progression */}
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 rounded-2xl p-8 border border-white/5 mb-8">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
            <TrendingUp size={20} className="text-green-500" />
            Progression du financement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-black/20">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Wallet size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-text-2">Objectif</p>
                <p className="text-xl font-bold text-white">{formatMontant(project.montant_cible)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-black/20">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-text-2">Collecté</p>
                <p className="text-xl font-bold text-white">{formatMontant(project.montant_actuel)}</p>
              </div>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm text-text-2">
            <span className="flex items-center gap-1"><BarChart size={14} /> Progression</span>
            <span className="text-green-500 font-bold">{project.progression}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 rounded-full h-3 transition-all duration-1000"
              style={{ width: `${project.progression}%` }}
            />
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1 text-text-2 text-sm">
              <Percent size={12} />
              {project.progression}% du financement atteint
            </span>
          </div>
        </div>

        {/* Bouton d'investissement */}
        {isInvestisseur && isOpen && (
          <div className="text-center">
            {!showInvestForm ? (
              <button
                onClick={() => setShowInvestForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
              >
                <Wallet size={20} />
                Investir dans ce projet
                <ChevronRight size={18} />
              </button>
            ) : (
              <div className="bg-gradient-to-br from-surface/50 to-surface/30 rounded-2xl p-8 border border-green-500/20 max-w-lg mx-auto">
                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                  <DollarSign size={20} className="text-green-500" />
                  Proposer un investissement
                </h3>
                <form onSubmit={handleInvest} className="space-y-4">
                  <div>
                    <label className="block text-text-2 text-sm mb-2">Montant (FCFA) *</label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="ex: 1000000"
                      className="w-full px-4 py-3 bg-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-text-2 text-sm mb-2">Message (optionnel)</label>
                    <textarea
                      value={investMessage}
                      onChange={(e) => setInvestMessage(e.target.value)}
                      rows={3}
                      placeholder="Pourquoi voulez-vous investir dans ce projet ?"
                      className="w-full px-4 py-3 bg-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="gold" disabled={investing} className="flex-1 bg-green-500 hover:bg-green-600">
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition-all"
              >
                <Building2 size={18} />
                Gérer ce projet
              </Link>
            ) : (
              <div className="bg-surface/30 rounded-2xl p-6 border border-white/5">
                <Award size={32} className="mx-auto mb-3 text-green-500" />
                <p className="text-text-2">Vous êtes porteur de projet. Créez vos propres projets !</p>
                <Link href="/dashboard/porteur/nouveau-projet" className="inline-block mt-3 text-green-500 hover:underline">
                  Créer un projet →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Message si projet fermé */}
        {!isOpen && (
          <div className="text-center bg-surface/30 rounded-2xl p-8 border border-white/5">
            <Clock size={40} className="mx-auto mb-3 text-text-2" />
            <p className="text-text-2">Ce projet n'est plus ouvert aux investissements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
