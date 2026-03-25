'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { loginUser, saveTokens } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(formData.username, formData.password);

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
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Espace Membre</h1>
          <p className="text-gray-400 text-sm">Accédez à vos investissements et projets.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-xl border border-gold/10 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Nom d&apos;utilisateur</label>
              <input
                type="text"
                required
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
                placeholder="votre_username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Mot de passe</label>
                <Link href="#" className="text-[10px] text-gray-400 hover:text-gold transition">Oublié ?</Link>
              </div>
              <input
                type="password"
                required
                className="bg-bg/50 border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" variant="gold" className="w-full py-4 font-bold mt-4" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>

          <p className="text-center mt-8 text-sm text-gray-400">
            Pas encore membre ?{' '}
            <Link href="/register" className="text-gold hover:underline font-bold">Rejoindre le réseau</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
