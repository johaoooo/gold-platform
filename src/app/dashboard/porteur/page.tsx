'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfile, getProjects, createProject, logout } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  username: string;
  email: string;
  phone: string;
  role: string;
}

interface Project {
  id: number;
  titre: string;
  secteur: string;
  localisation: string;
  montant_cible: number;
  progression: number;
  description: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SECTEUR_COLOR: Record<string, string> = {
  Agriculture: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Tech:        'text-blue-400   bg-blue-500/10   border-blue-500/20',
  Énergie:     'text-amber-400  bg-amber-500/10  border-amber-500/20',
  Immobilier:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

function formatMoney(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-2 hover:border-gold/20 transition-all duration-300">
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</span>
      <span className="text-3xl font-bold text-gold" style={{ fontFamily: 'Georgia, serif' }}>{value}</span>
      {sub && <span className="text-xs text-white/30">{sub}</span>}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function DashboardPorteur() {
  const router = useRouter();

  const [user,       setUser]       = useState<User | null>(null);
  const [projects,   setProjects]   = useState<Project[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [activeTab,  setActiveTab]  = useState<'overview' | 'projects' | 'submit' | 'profile'>('overview');

  // Formulaire soumission projet
  const [form, setForm] = useState({
    titre: '',
    secteur: 'Agriculture',
    localisation: '',
    montant_cible: '',
    description: '',
  });
  const [submitting,   setSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError,   setSubmitError]   = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [profileData, projectData] = await Promise.all([
          getProfile(),
          getProjects(),
        ]);
        setUser(profileData);
        setProjects(projectData);
      } catch {
        setError('Session expirée. Redirection...');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleLogout = () => {
    logout();
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/');
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    try {
      await createProject({
        titre: form.titre,
        secteur: form.secteur,
        localisation: form.localisation,
        montant_cible: Number(form.montant_cible),
        description: form.description,
      });
      setSubmitSuccess('Projet soumis avec succès ! Il sera examiné par notre équipe.');
      setForm({ titre: '', secteur: 'Agriculture', localisation: '', montant_cible: '', description: '' });
      // Rafraîchir la liste
      const updated = await getProjects();
      setProjects(updated);
      setTimeout(() => setSubmitSuccess(''), 4000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCible = projects.reduce((s, p) => s + p.montant_cible, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-white/40 text-sm uppercase tracking-widest">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white">

      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-surface/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex flex-col gap-0.5">
            <span style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.25em', fontSize: '14px' }} className="text-white uppercase">Golden</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, #10b981)' }} />
              <span style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.3em', fontSize: '9px', color: '#10b981' }} className="uppercase">Invest</span>
              <div className="w-4 h-px" style={{ background: 'linear-gradient(90deg, #10b981, transparent)' }} />
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {([
            { id: 'overview',  label: 'Vue d\'ensemble', icon: '◈' },
            { id: 'projects',  label: 'Mes projets',     icon: '◇' },
            { id: 'submit',    label: 'Soumettre',        icon: '◎' },
            { id: 'profile',   label: 'Mon profil',       icon: '◉' },
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left
                ${activeTab === item.id
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-syne uppercase tracking-wider text-[11px]">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profil rapide + logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.username}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Porteur de projet</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-[11px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors py-2 font-syne"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <main className="ml-64 p-8">

        {/* ── TAB : Vue d'ensemble ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Tableau de bord</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Bonjour, <span className="text-gold">{user?.username}</span>
              </h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Projets soumis"      value={String(projects.length)}       sub="Dans le réseau Golden" />
              <StatCard label="Capital recherché"   value={formatMoney(totalCible)}       sub="Tous projets confondus" />
              <StatCard label="Progression moyenne" value={
                projects.length
                  ? `${Math.round(projects.reduce((s, p) => s + p.progression, 0) / projects.length)}%`
                  : '0%'
              } sub="Taux de financement" />
            </div>

            {/* Aperçu projets */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Mes projets récents</h2>
              {projects.length === 0 ? (
                <div className="bg-surface/40 border border-white/5 rounded-2xl p-10 text-center text-white/30 text-sm">
                  Aucun projet soumis pour le moment.<br />
                  <button onClick={() => setActiveTab('submit')} className="mt-3 text-gold underline text-xs">
                    Soumettre mon premier projet →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 4).map((p) => (
                    <div key={p.id} className="bg-surface/40 border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gold/10 transition-all">
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${SECTEUR_COLOR[p.secteur] ?? 'text-white/50 bg-white/5 border-white/10'}`}>
                          {p.secteur}
                        </span>
                        <span className="text-white text-sm font-medium">{p.titre}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-gold font-bold text-sm">{formatMoney(p.montant_cible)}</span>
                        <span className="text-white/30 text-xs">{p.progression}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB : Mes projets ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Portefeuille</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Mes projets</h1>
            </div>
            {projects.length === 0 ? (
              <div className="bg-surface/40 border border-white/5 rounded-2xl p-16 text-center text-white/30 text-sm">
                Aucun projet enregistré.<br />
                <button onClick={() => setActiveTab('submit')} className="mt-3 text-gold underline text-xs">
                  Soumettre un projet →
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="bg-surface/40 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 group">
                    <div className="mb-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${SECTEUR_COLOR[p.secteur] ?? 'text-white/50 bg-white/5 border-white/10'}`}>
                        {p.secteur}
                      </span>
                      <h3 className="text-white font-bold mt-3 text-lg group-hover:text-gold transition-colors" style={{ fontFamily: 'Georgia, serif' }}>{p.titre}</h3>
                      <p className="text-white/30 text-xs mt-1">{p.localisation}</p>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed mb-4">{p.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/30 mb-1">
                        <span>Financement</span>
                        <span className="text-gold">{p.progression}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                          style={{ width: `${p.progression}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-white/50 text-xs">
                      Objectif : <span className="text-white font-bold">{formatMoney(p.montant_cible)}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB : Soumettre un projet ── */}
        {activeTab === 'submit' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Nouveau</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Soumettre un projet</h1>
            </div>

            <form onSubmit={handleSubmitProject} className="bg-surface/40 border border-white/5 rounded-2xl p-8 space-y-5">

              {submitSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
                  {submitSuccess}
                </div>
              )}
              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                  {submitError}
                </div>
              )}

              {/* Titre */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Titre du projet</label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                  placeholder="Ex: Ferme solaire au Nord Bénin"
                />
              </div>

              {/* Secteur */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Secteur</label>
                <select
                  value={form.secteur}
                  onChange={(e) => setForm({ ...form, secteur: e.target.value })}
                  className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all"
                >
                  {['Agriculture', 'Tech', 'Énergie', 'Immobilier', 'Santé', 'Éducation', 'Commerce'].map((s) => (
                    <option key={s} value={s} className="bg-surface">{s}</option>
                  ))}
                </select>
              </div>

              {/* Localisation */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Localisation</label>
                <input
                  type="text"
                  required
                  value={form.localisation}
                  onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                  className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                  placeholder="Ex: Cotonou, Bénin"
                />
              </div>

              {/* Montant cible */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Montant cible (FCFA)</label>
                <input
                  type="number"
                  required
                  min="100000"
                  value={form.montant_cible}
                  onChange={(e) => setForm({ ...form, montant_cible: e.target.value })}
                  className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                  placeholder="Ex: 5000000"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Description</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all resize-none placeholder:text-gray-600"
                  placeholder="Décrivez votre projet, ses objectifs et son impact..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gold text-bg font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre le projet'}
              </button>
            </form>
          </div>
        )}

        {/* ── TAB : Profil ── */}
        {activeTab === 'profile' && user && (
          <div className="space-y-6 max-w-lg">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Compte</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Mon profil</h1>
            </div>
            <div className="bg-surface/40 border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-xl font-bold">{user.username}</p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/20 bg-gold/5 px-3 py-1 rounded-full">Porteur de projet</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 space-y-4">
                {[
                  { label: 'Email',     value: user.email || 'Non renseigné' },
                  { label: 'Téléphone', value: user.phone || 'Non renseigné' },
                  { label: 'Rôle',      value: 'Porteur de projet' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{item.label}</span>
                    <span className="text-white text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
