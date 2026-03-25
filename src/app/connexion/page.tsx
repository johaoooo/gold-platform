'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const API_URL = 'http://127.0.0.1:8000/api';

export default function ConnexionPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        // Stocker les tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Stocker dans les cookies pour le middleware
        document.cookie = `access_token=${data.access}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; SameSite=Lax`;
        
        console.log('✅ Connexion réussie !');
        console.log('Rôle:', data.user.role);
        
        // Forcer un rechargement complet pour que la navbar se mette à jour
        // et rediriger selon le rôle
        if (data.user.role === 'investisseur') {
          window.location.href = '/dashboard/investisseur';
        } else if (data.user.role === 'porteur') {
          window.location.href = '/dashboard/porteur';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
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
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}
          
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
          
          {/* Comptes de test */}
          <div className="mt-6 pt-6 border-t border-surface-2">
            <p className="text-xs text-text-3 text-center mb-2">Comptes de test :</p>
            <div className="text-xs text-text-2 text-center space-y-1">
              <p>📌 investisseur: invest_ouattara / invest123</p>
              <p>📌 porteur: agritech_benin / porteur123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
