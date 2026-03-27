'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function ConnexionPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'investisseur' && data.user.is_approved === false) {
          toast.error('Votre compte est en attente de validation (24-48h).');
          setLoading(false);
          return;
        }

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `access_token=${data.access}; path=/; max-age=3600; SameSite=Lax`;

        toast.success(`Bienvenue ${data.user.username} !`);

        if (data.user.role === 'investisseur') {
          setTimeout(() => router.push('/dashboard/investisseur'), 500);
        } else {
          setTimeout(() => router.push('/dashboard/porteur'), 500);
        }
      } else {
        toast.error(data.error || data.detail || 'Identifiants incorrects');
      }
    } catch {
      toast.error('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 bg-bg min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Connexion
          </h1>
          <p className="text-text-2 text-sm">Accédez à votre espace Golden Invest</p>
        </div>

        <div className="bg-surface/50 rounded-xl border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-text-2 mb-1 block">Nom d'utilisateur</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-2 mb-1 block">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-text-2 text-sm mt-6">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="text-green-500 hover:underline font-medium">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
