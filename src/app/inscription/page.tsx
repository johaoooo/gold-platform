'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Briefcase, CheckCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { registerUser, saveTokens } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'porteur',
    phone: '',
    // Champs investisseur
    investor_type: '',
    investment_experience: '',
    investment_areas: '',
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
            Votre demande d&apos;accès investisseur a bien été reçue. Notre équipe va examiner votre dossier sous 24 à 48h.
          </p>
          <Link href="/projets">
            <Button variant="gold" className="w-full py-4">
              Explorer les projets
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg py-20">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Rejoindre le <span className="text-green-500">réseau</span>
          </h1>
          <p className="text-text-2 text-sm">Créez votre compte Golden Invest</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-xl border border-green-500/10 p-6 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Rôle */}
          <div className="flex gap-3 mb-5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'porteur' })}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                formData.role === 'porteur'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-green-500/20 text-text-2 hover:border-green-500/50 bg-surface'
              }`}
            >
              <Briefcase size={18} />
              Porteur
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'investisseur' })}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                formData.role === 'investisseur'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-green-500/20 text-text-2 hover:border-green-500/50 bg-surface'
              }`}
            >
              <TrendingUp size={18} />
              Investisseur
            </button>
          </div>

          {/* Champs communs */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Nom d'utilisateur</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Mot de passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50" />
              <p className="text-[10px] text-text-2 mt-1">8 caractères minimum</p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Téléphone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
          </div>

          {/* Champs spécifiques investisseur */}
          {formData.role === 'investisseur' && (
            <div className="mt-5 pt-4 border-t border-green-500/20 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Type d'investisseur</label>
                <div className="relative mt-1">
                  <select name="investor_type" value={formData.investor_type} onChange={handleChange}
                    className="w-full appearance-none bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50">
                    <option value="">Sélectionnez</option>
                    <option value="individual">Investisseur individuel</option>
                    <option value="business_angel">Business Angel</option>
                    <option value="family_office">Family Office</option>
                    <option value="institutionnel">Institutionnel</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-text-2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Expérience</label>
                <div className="relative mt-1">
                  <select name="investment_experience" value={formData.investment_experience} onChange={handleChange}
                    className="w-full appearance-none bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50">
                    <option value="">Sélectionnez</option>
                    <option value="debutant">Débutant (0-2 ans)</option>
                    <option value="intermediaire">Intermédiaire (2-5 ans)</option>
                    <option value="expert">Expert (5+ ans)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-text-2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Secteurs d'intérêt</label>
                <div className="relative mt-1">
                  <select name="investment_areas" value={formData.investment_areas} onChange={handleChange}
                    className="w-full appearance-none bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50">
                    <option value="">Sélectionnez</option>
                    <option value="tech">Tech / Startup</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="energie">Énergie</option>
                    <option value="immobilier">Immobilier</option>
                    <option value="sante">Santé</option>
                    <option value="education">Éducation</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-text-2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Pourquoi investir en Afrique ?</label>
                <textarea name="motivation" rows={3} value={formData.motivation} onChange={handleChange}
                  placeholder="Partagez votre vision..."
                  className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
              </div>
            </div>
          )}

          {/* Info rôle */}
          {formData.role === 'investisseur' && (
            <div className="mt-5 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
              <p className="text-xs text-text-2 flex items-center gap-2">
                <Clock size={12} className="text-green-500" />
                Votre compte sera activé après validation par notre équipe (24-48h)
              </p>
            </div>
          )}

          {formData.role === 'porteur' && (
            <div className="mt-5 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
              <p className="text-xs text-text-2 flex items-center gap-2">
                <CheckCircle size={12} className="text-green-500" />
                Accès immédiat à votre espace porteur après inscription
              </p>
            </div>
          )}

          <Button type="submit" className="w-full py-3 mt-6" variant="gold" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>

          <p className="text-center mt-5 text-xs text-text-2">
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
