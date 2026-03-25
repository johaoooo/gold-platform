'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfile, getMyInvestments, getProjects, investInProject, logout } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  username: string;
  email: string;
  phone: string;
  role: string;
}

interface Investment {
  id: number;
  project_titre: string;
  project_secteur: string;
  montant: number;
  statut: string;
  message: string;
  created_at: string;
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

const STATUT_COLOR: Record<string, string> = {
  en_attente: 'text-amber-400  bg-amber-500/10  border-amber-500/20',
  accepté:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  refusé:     'text-red-400    bg-red-500/10    border-red-500/20',
};

function formatMoney(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);
}

// ─── Composants ──────────────────────────────────────────────────────────────

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

export default function DashboardInvestisseur() {
  const router = useRouter();

  const [user,        setUser]        = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [activeTab,   setActiveTab]   = useState<'overview' | 'investments' | 'projects' | 'profile'>('overview');

  // Modal investissement
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investAmount,     setInvestAmount]     = useState('');
  const [investMessage,    setInvestMessage]    = useState('');
  const [investing,        setInvesting]        = useState(false);
  const [investSuccess,    setInvestSuccess]    = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [profileData, investData, projectData] = await Promise.all([
          getProfile(),
          getMyInvestments(),
          getProjects(),
        ]);
        setUser(profileData);
        setInvestments(investData);
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

  const handleInvest = async () => {
    if (!selectedProject || !investAmount) return;
    setInvesting(true);
    try {
      await investInProject({
        project_id: selectedProject.id,
        montant: Number(investAmount),
        message: investMessage,
      });
      setInvestSuccess(`Investissement de ${formatMoney(Number(investAmount))} enregistré !`);
      setInvestAmount('');
      setInvestMessage('');
      // Rafraîchir les investissements
      const updated = await getMyInvestments();
      setInvestments(updated);
      setTimeout(() => { setInvestSuccess(''); setSelectedProject(null); }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur investissement');
    } finally {
      setInvesting(false);
    }
  };

  // Stats calculées
  const totalInvesti   = investments.reduce((s, i) => s + i.montant, 0);
  const nbProjets      = new Set(investments.map((i) => i.project_titre)).size;
  const nbAcceptes     = investments.filter((i) => i.statut === 'accepté').length;

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
            { id: 'overview',     label: 'Vue d\'ensemble', icon: '◈' },
            { id: 'investments',  label: 'Mes investissements', icon: '◎' },
            { id: 'projects',     label: 'Projets disponibles', icon: '◇' },
            { id: 'profile',      label: 'Mon profil', icon: '◉' },
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
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Investisseur</p>
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
              <StatCard label="Total investi" value={formatMoney(totalInvesti)} sub="Tous projets confondus" />
              <StatCard label="Projets financés" value={String(nbProjets)} sub="Portefeuille diversifié" />
              <StatCard label="Investissements acceptés" value={String(nbAcceptes)} sub={`sur ${investments.length} au total`} />
            </div>

            {/* Derniers investissements */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Activité récente</h2>
              {investments.length === 0 ? (
                <div className="bg-surface/40 border border-white/5 rounded-2xl p-10 text-center text-white/30 text-sm">
                  Aucun investissement pour le moment.<br />
                  <button onClick={() => setActiveTab('projects')} className="mt-3 text-gold underline text-xs">Découvrir les projets →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.slice(0, 4).map((inv) => (
                    <div key={inv.id} className="bg-surface/40 border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gold/10 transition-all">
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${SECTEUR_COLOR[inv.project_secteur] ?? 'text-white/50 bg-white/5 border-white/10'}`}>
                          {inv.project_secteur}
                        </span>
                        <span className="text-white text-sm font-medium">{inv.project_titre}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-gold font-bold text-sm">{formatMoney(inv.montant)}</span>
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUT_COLOR[inv.statut] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                          {inv.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                  {investments.length > 4 && (
                    <button onClick={() => setActiveTab('investments')} className="text-xs text-gold/60 hover:text-gold transition-colors pl-2">
                      Voir tous les investissements →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB : Mes investissements ── */}
        {activeTab === 'investments' && (
          <div className="space-y-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Portefeuille</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Mes investissements</h1>
            </div>
            {investments.length === 0 ? (
              <div className="bg-surface/40 border border-white/5 rounded-2xl p-16 text-center text-white/30 text-sm">
                Aucun investissement enregistré.
              </div>
            ) : (
              <div className="space-y-3">
                {investments.map((inv) => (
                  <div key={inv.id} className="bg-surface/40 border border-white/5 rounded-2xl p-6 hover:border-gold/10 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${SECTEUR_COLOR[inv.project_secteur] ?? 'text-white/50 bg-white/5 border-white/10'}`}>
                          {inv.project_secteur}
                        </span>
                        <h3 className="text-white font-bold mt-2">{inv.project_titre}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold" style={{ fontFamily: 'Georgia, serif' }}>{formatMoney(inv.montant)}</p>
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUT_COLOR[inv.statut] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                          {inv.statut}
                        </span>
                      </div>
                    </div>
                    {inv.message && <p className="text-white/30 text-xs italic mt-2">"{inv.message}"</p>}
                    <p className="text-white/20 text-[10px] mt-3 uppercase tracking-wider">
                      {new Date(inv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB : Projets disponibles ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Opportunités</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Projets disponibles</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-surface/40 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${SECTEUR_COLOR[p.secteur] ?? 'text-white/50 bg-white/5 border-white/10'}`}>
                        {p.secteur}
                      </span>
                      <h3 className="text-white font-bold mt-3 text-lg group-hover:text-gold transition-colors" style={{ fontFamily: 'Georgia, serif' }}>{p.titre}</h3>
                      <p className="text-white/30 text-xs mt-1">{p.localisation}</p>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{p.description}</p>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/30 mb-1">
                      <span>Progression</span>
                      <span className="text-gold">{p.progression}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500" style={{ width: `${p.progression}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">Objectif : <span className="text-white font-bold">{formatMoney(p.montant_cible)}</span></span>
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-bg transition-all duration-300"
                    >
                      Investir
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-xl font-bold">{user.username}</p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/20 bg-gold/5 px-3 py-1 rounded-full">Investisseur</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 space-y-4">
                {[
                  { label: 'Email',     value: user.email },
                  { label: 'Téléphone', value: user.phone || 'Non renseigné' },
                  { label: 'Rôle',      value: 'Investisseur' },
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

      {/* ── Modal investissement ── */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-surface border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              Investir dans
            </h2>
            <p className="text-gold mb-6 font-bold">{selectedProject.titre}</p>

            {investSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
                {investSuccess}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Montant (FCFA)</label>
                  <input
                    type="number"
                    min="1000"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all"
                    placeholder="Ex: 500000"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Message (optionnel)</label>
                  <textarea
                    rows={3}
                    value={investMessage}
                    onChange={(e) => setInvestMessage(e.target.value)}
                    className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all resize-none"
                    placeholder="Votre message au porteur..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleInvest}
                    disabled={investing || !investAmount}
                    className="flex-1 py-3 rounded-xl bg-gold text-bg text-sm font-bold uppercase tracking-wider hover:bg-gold-light transition-all disabled:opacity-50"
                  >
                    {investing ? 'Envoi...' : 'Confirmer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
