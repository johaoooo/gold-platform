'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        document.cookie = `access_token=${data.access}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; SameSite=Lax`;
        
        toast.success(`Bienvenue ${data.user.username} !`);
        
        if (data.user.role === 'investisseur') {
          setTimeout(() => window.location.href = '/dashboard/investisseur', 500);
        } else if (data.user.role === 'porteur') {
          setTimeout(() => window.location.href = '/dashboard/porteur', 500);
        } else {
          setTimeout(() => window.location.href = '/', 500);
        }
      } else {
        toast.error(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      toast.error('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-20">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-surface rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-playfair text-gold text-center mb-8">
            Connexion
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-2 font-dm mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-2 font-dm mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            
            <Button
              type="submit"
              variant="gold"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          
          <p className="text-center text-text-2 text-sm mt-6">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="text-gold hover:underline">
              S'inscrire
            </a>
          </p>
          
          <div className="mt-6 pt-6 border-t border-surface-2">
          </div>
        </div>
      </div>
    </div>
  );
}
