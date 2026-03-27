'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Briefcase, CheckCircle, Clock, AlertCircle, User, Mail, Lock, Phone, Building2, Globe, MapPin, BriefcaseBusiness, DollarSign, Target, FileText, Calendar, Award, ChevronRight } from 'lucide-react';
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
    investment_areas: [] as string[],
    investment_min: '',
    investment_max: '',
    investor_type: '',
    net_worth: '',
    motivation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const investmentAreas = [
    { id: 'tech', label: 'Tech / Startup' },
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'energie', label: 'Énergie / Solaire' },
    { id: 'immobilier', label: 'Immobilier' },
    { id: 'sante', label: 'Santé' },
    { id: 'education', label: 'Éducation' },
    { id: 'fintech', label: 'FinTech' },
  ];

  const toggleInvestmentArea = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      investment_areas: prev.investment_areas.includes(areaId)
        ? prev.investment_areas.filter(a => a !== areaId)
        : [...prev.investment_areas, areaId]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation étape 1
  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError('Nom d\'utilisateur requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email requis');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Mot de passe (8 caractères minimum)');
      return false;
    }
    setError('');
    return true;
  };

  // Validation étape 2 (identité)
  const validateStep2 = () => {
    if (!formData.full_name.trim()) {
      setError('Nom complet requis');
      return false;
    }
    if (!formData.birth_date) {
      setError('Date de naissance requise');
      return false;
    }
    if (!formData.nationality.trim()) {
      setError('Nationalité requise');
      return false;
    }
    if (!formData.country_of_residence.trim()) {
      setError('Pays de résidence requis');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Ville requise');
      return false;
    }
    setError('');
    return true;
  };

  // Validation étape 3 (profil professionnel)
  const validateStep3 = () => {
    if (!formData.company.trim()) {
      setError('Nom de la société requis');
      return false;
    }
    if (!formData.position.trim()) {
      setError('Poste requis');
      return false;
    }
    if (!formData.investment_experience) {
      setError('Expérience en investissement requise');
      return false;
    }
    if (!formData.investor_type) {
      setError('Type d\'investisseur requis');
      return false;
    }
    setError('');
    return true;
  };

  // Validation étape 4 (investissement)
  const validateStep4 = () => {
    if (formData.investment_areas.length === 0) {
      setError('Au moins un secteur d\'intérêt requis');
      return false;
    }
    if (!formData.investment_min) {
      setError('Montant minimum requis');
      return false;
    }
    if (!formData.investment_max) {
      setError('Montant maximum requis');
      return false;
    }
    if (parseInt(formData.investment_min) > parseInt(formData.investment_max)) {
      setError('Le montant minimum ne peut pas être supérieur au maximum');
      return false;
    }
    if (!formData.net_worth.trim()) {
      setError('Valeur nette requise');
      return false;
    }
    if (!formData.motivation.trim()) {
      setError('Motivation requise');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3 && validateStep3()) setStep(4);
  };

  const handlePrev = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;
    
    setError('');
    setLoading(true);
    
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
      <main className="min-h-screen flex items-center justify-center px-6 bg-bg pt-32 pb-20">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <Clock size={36} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Demande envoyée
          </h1>
          <p className="text-text-2 text-sm leading-relaxed mb-8">
            Votre demande d&apos;accès investisseur a bien été reçue. Notre équipe va examiner votre dossier sous 24 à 48h.
          </p>
          <Link href="/projets">
            <Button variant="gold" className="w-full py-4 bg-green-500 hover:bg-green-600">
              Explorer les projets
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Inscription
          </h1>
          <p className="text-text-2 text-sm">Créez votre compte Golden Invest</p>
        </div>

        <div className="bg-surface/50 rounded-xl border border-white/5 p-8">
          {/* Steps indicator */}
          {formData.role === 'investisseur' && (
            <div className="flex justify-between mb-8 px-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s ? 'bg-green-500 text-white' : 'bg-white/10 text-text-2'
                  }`}>
                    {s}
                  </div>
                  <span className="text-[10px] text-text-2 mt-1">
                    {s === 1 && 'Compte'}
                    {s === 2 && 'Identité'}
                    {s === 3 && 'Profil'}
                    {s === 4 && 'Investissement'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Étape 1 : Rôle et informations de base */}
            {step === 1 && (
              <>
                <div>
                  <label className="text-xs text-text-2 mb-1 block">Je suis un</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, role: 'porteur' });
                        setStep(1);
                      }}
                      className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                        formData.role === 'porteur'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-bg border-white/10 text-text-2 hover:border-green-500'
                      }`}
                    >
                      <Briefcase size={16} className="inline mr-2" />
                      Porteur
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, role: 'investisseur' });
                        setStep(2);
                      }}
                      className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                        formData.role === 'investisseur'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-bg border-white/10 text-text-2 hover:border-green-500'
                      }`}
                    >
                      <TrendingUp size={16} className="inline mr-2" />
                      Investisseur
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Nom d'utilisateur *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Email *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Mot de passe *</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-[10px] text-text-2 mt-1">8 caractères minimum</p>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Téléphone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {formData.role === 'porteur' && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Inscription...' : 'Créer mon compte'}
                  </button>
                )}

                {formData.role === 'investisseur' && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continuer
                    <ChevronRight size={16} />
                  </button>
                )}
              </>
            )}

            {/* Étape 2 : Identité (investisseur) */}
            {step === 2 && formData.role === 'investisseur' && (
              <>
                <div>
                  <label className="text-xs text-text-2 mb-1 block">Nom complet *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Date de naissance *</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Nationalité *</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Pays de résidence *</label>
                    <input
                      type="text"
                      name="country_of_residence"
                      value={formData.country_of_residence}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 py-3 rounded-lg border border-white/10 text-text-2 hover:text-white transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all"
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {/* Étape 3 : Profil professionnel */}
            {step === 3 && formData.role === 'investisseur' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Société *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Poste *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Expérience en investissement *</label>
                  <select
                    name="investment_experience"
                    value={formData.investment_experience}
                    onChange={handleChange}
                    className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="debutant">Débutant (0-2 ans)</option>
                    <option value="intermediaire">Intermédiaire (2-5 ans)</option>
                    <option value="expert">Expert (5+ ans)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Type d'investisseur *</label>
                  <select
                    name="investor_type"
                    value={formData.investor_type}
                    onChange={handleChange}
                    className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="individual">Investisseur individuel</option>
                    <option value="business_angel">Business Angel</option>
                    <option value="family_office">Family Office</option>
                    <option value="institutionnel">Institutionnel</option>
                  </select>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 py-3 rounded-lg border border-white/10 text-text-2 hover:text-white transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all"
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {/* Étape 4 : Investissement */}
            {step === 4 && formData.role === 'investisseur' && (
              <>
                <div>
                  <label className="text-xs text-text-2 mb-1 block">Secteurs d'intérêt *</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {investmentAreas.map(area => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleInvestmentArea(area.id)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          formData.investment_areas.includes(area.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-text-2 hover:bg-white/20'
                        }`}
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Montant min (FCFA) *</label>
                    <input
                      type="number"
                      name="investment_min"
                      value={formData.investment_min}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-2 mb-1 block">Montant max (FCFA) *</label>
                    <input
                      type="number"
                      name="investment_max"
                      value={formData.investment_max}
                      onChange={handleChange}
                      className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Valeur nette estimée *</label>
                  <input
                    type="text"
                    name="net_worth"
                    value={formData.net_worth}
                    onChange={handleChange}
                    placeholder="ex: 100 000 000 FCFA"
                    className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-2 mb-1 block">Pourquoi investir en Afrique ? *</label>
                  <textarea
                    name="motivation"
                    rows={3}
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="Partagez votre vision..."
                    className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 py-3 rounded-lg border border-white/10 text-text-2 hover:text-white transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all disabled:opacity-50"
                  >
                    {loading ? 'Inscription...' : 'Créer mon compte'}
                  </button>
                </div>
              </>
            )}

            {formData.role === 'porteur' && (
              <p className="text-center text-text-2 text-sm mt-6">
                Déjà un compte ?{' '}
                <Link href="/connexion" className="text-green-500 hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            )}
          </form>

          {formData.role === 'investisseur' && step === 1 && (
            <p className="text-center text-text-2 text-sm mt-6">
              Déjà un compte ?{' '}
              <Link href="/connexion" className="text-green-500 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
