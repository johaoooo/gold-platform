'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Briefcase, CheckCircle, Clock, AlertCircle, User, Building2, Globe, MapPin, BriefcaseBusiness, DollarSign, Target, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { registerUser, saveTokens } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'porteur',
    phone: '',
    // Champs investisseur
    full_name: '',
    birth_date: '',
    nationality: '',
    country_of_residence: '',
    city: '',
    company: '',
    position: '',
    investment_experience: '',
    investment_areas: '',
    investment_min: '',
    investment_max: '',
    investor_type: '',
    net_worth: '',
    motivation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validation mot de passe
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }
    
    try {
      const data = await registerUser(formData);

      if (formData.role === 'porteur') {
        saveTokens(data.access, data.refresh);
        document.cookie = `access_token=${data.access}; path=/; max-age=3600; SameSite=Lax`;
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard/porteur');
      } else {
        setPendingApproval(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Écran de confirmation pour les investisseurs
  if (pendingApproval) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-bg py-20">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <Clock size={36} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Demande envoyée
          </h1>
          <p className="text-text-2 text-sm leading-relaxed mb-8">
            Votre demande d&apos;accès investisseur a bien été reçue. Notre équipe va examiner votre dossier et vous enverrez une confirmation par email sous <strong className="text-white">24 à 48h</strong>.
          </p>
          <Link href="/projets">
            <Button variant="gold" className="w-full py-4">
              Explorer les projets en attendant
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Rejoindre le <span className="text-green-500">réseau</span>
          </h1>
          <p className="text-text-2 text-sm">Créez votre compte Golden Invest</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-xl border border-green-500/10 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Étape 1 : Rôle et informations de base */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Je suis un</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'porteur' })}
                    className={`py-4 px-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                      formData.role === 'porteur'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-green-500/20 text-text-2 hover:border-green-500/50 bg-surface'
                    }`}
                  >
                    <Briefcase size={20} />
                    <span>Porteur</span>
                    <span className="text-[10px] font-normal opacity-70">Accès immédiat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'investisseur' })}
                    className={`py-4 px-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                      formData.role === 'investisseur'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-green-500/20 text-text-2 hover:border-green-500/50 bg-surface'
                    }`}
                  >
                    <TrendingUp size={20} />
                    <span>Investisseur</span>
                    <span className="text-[10px] font-normal opacity-70">Sous approbation</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Nom d'utilisateur *</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Mot de passe *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                <p className="text-xs text-text-2 mt-1">8 caractères minimum</p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Téléphone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <Button type="button" onClick={() => setStep(2)} className="w-full py-4 mt-4" variant="gold">
                Continuer
              </Button>
            </div>
          )}

          {/* Étape 2 : Informations personnelles (investisseur) */}
          {step === 2 && formData.role === 'investisseur' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Nom complet</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Date de naissance</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Nationalité</label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Pays de résidence</label>
                  <input type="text" name="country_of_residence" value={formData.country_of_residence} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Ville</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <Button type="button" onClick={() => setStep(3)} className="w-full py-4 mt-4" variant="gold">
                Continuer
              </Button>
            </div>
          )}

          {/* Étape 3 : Informations professionnelles */}
          {step === 3 && formData.role === 'investisseur' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Société</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Poste</label>
                  <input type="text" name="position" value={formData.position} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Expérience en investissement</label>
                <select name="investment_experience" value={formData.investment_experience} onChange={handleChange}
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50">
                  <option value="">Sélectionnez</option>
                  <option value="debutant">Débutant (0-2 ans)</option>
                  <option value="intermediaire">Intermédiaire (2-5 ans)</option>
                  <option value="expert">Expert (5+ ans)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Secteurs d'intérêt</label>
                <input type="text" name="investment_areas" value={formData.investment_areas} onChange={handleChange}
                  placeholder="Tech, Agriculture, Énergie, Immobilier..."
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <Button type="button" onClick={() => setStep(4)} className="w-full py-4 mt-4" variant="gold">
                Continuer
              </Button>
            </div>
          )}

          {/* Étape 4 : Informations financières */}
          {step === 4 && formData.role === 'investisseur' && (
            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Type d'investisseur</label>
                <select name="investor_type" value={formData.investor_type} onChange={handleChange}
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50">
                  <option value="">Sélectionnez</option>
                  <option value="individual">Investisseur individuel</option>
                  <option value="family_office">Family Office</option>
                  <option value="institutionnel">Institutionnel</option>
                  <option value="business_angel">Business Angel</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Montant min par projet (FCFA)</label>
                  <input type="number" name="investment_min" value={formData.investment_min} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Montant max par projet (FCFA)</label>
                  <input type="number" name="investment_max" value={formData.investment_max} onChange={handleChange}
                    className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Valeur nette (FCFA)</label>
                <input type="text" name="net_worth" value={formData.net_worth} onChange={handleChange}
                  placeholder="ex: 100 000 000"
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50" />
              </div>

              <Button type="button" onClick={() => setStep(5)} className="w-full py-4 mt-4" variant="gold">
                Continuer
              </Button>
            </div>
          )}

          {/* Étape 5 : Motivation */}
          {step === 5 && formData.role === 'investisseur' && (
            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Pourquoi souhaitez-vous investir en Afrique ?</label>
                <textarea name="motivation" rows={4} value={formData.motivation} onChange={handleChange}
                  placeholder="Partagez votre vision et vos objectifs d'investissement..."
                  className="w-full mt-2 bg-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 resize-none" />
              </div>

              <Button type="submit" className="w-full py-4 mt-4" variant="gold" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </div>
          )}

          {/* Pour porteur : validation directe */}
          {formData.role === 'porteur' && step === 2 && (
            <div>
              <Button type="submit" className="w-full py-4" variant="gold" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </div>
          )}

          <p className="text-center mt-6 text-sm text-text-2">
            Déjà membre ?{' '}
            <Link href="/connexion" className="text-green-500 hover:underline font-bold">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
