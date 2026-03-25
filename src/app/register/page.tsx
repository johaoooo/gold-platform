'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { registerUser, saveTokens } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'investisseur',
    phone: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(formData);

      // Sauvegarde localStorage + cookie (pour le middleware)
      saveTokens(data.access, data.refresh);
      document.cookie = `access_token=${data.access}; path=/; max-age=3600; SameSite=Lax`;

      if (data.user.role === 'investisseur') {
        router.push('/dashboard/investisseur');
      } else {
        router.push('/dashboard/porteur');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg relative overflow-hidden py-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Rejoindre le réseau</h1>
          <p className="text-gray-400 text-sm">Créez votre compte Golden Invest.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-xl border border-gold/10 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Nom d&apos;utilisateur</label>
              <input type="text" required
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                placeholder="john_doe"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Email</label>
              <input type="email" required
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                placeholder="nom@exemple.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Téléphone</label>
              <input type="tel"
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                placeholder="+229 97 00 00 00"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Mot de passe</label>
              <input type="password" required
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Je suis un</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button"
                  onClick={() => setFormData({ ...formData, role: 'investisseur' })}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.role === 'investisseur' ? 'bg-gold text-bg border-gold' : 'border-gold/20 text-gray-400 hover:border-gold/50'}`}>
                  💰 Investisseur
                </button>
                <button type="button"
                  onClick={() => setFormData({ ...formData, role: 'porteur' })}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.role === 'porteur' ? 'bg-gold text-bg border-gold' : 'border-gold/20 text-gray-400 hover:border-gold/50'}`}>
                  🚀 Porteur
                </button>
              </div>
            </div>

            <Button variant="gold" className="w-full py-4 font-bold mt-2" disabled={loading}>
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-400">
            Déjà membre ?{' '}
            <Link href="/login" className="text-gold hover:underline font-bold">Se connecter</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
