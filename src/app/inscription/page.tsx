'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : 'https://backend-gold-iubc.onrender.com/api';

export default function InscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'investisseur',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validation du mot de passe
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || '✅ Votre demande d\'inscription a bien été envoyée ! Un administrateur va valider votre compte sous 24h.');
        
        // Réinitialiser le formulaire
        setForm({
          username: '',
          email: '',
          password: '',
          role: 'investisseur',
          phone: '',
        });
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      } else {
        // Afficher l'erreur spécifique
        if (data.password && data.password[0]) {
          setError(data.password[0]);
        } else if (data.username && data.username[0]) {
          setError(data.username[0]);
        } else if (data.email && data.email[0]) {
          setError(data.email[0]);
        } else {
          setError(data.error || Object.values(data).flat().join(', '));
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-20">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-surface rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-playfair text-gold text-center mb-8">
            Inscription
          </h1>
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-500 rounded-lg p-4 mb-6 text-sm text-center">
              {successMessage}
              <div className="text-xs mt-2 text-text-2">Redirection vers la connexion...</div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-2 font-dm mb-2">Nom d'utilisateur *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-2 font-dm mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-2 font-dm mb-2">Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold"
                required
              />
              {form.password && form.password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Le mot de passe doit contenir au moins 8 caractères
                </p>
              )}
              {form.password && form.password.length >= 8 && (
                <p className="text-xs text-green-500 mt-1">
                  ✓ Mot de passe valide
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-text-2 font-dm mb-2">Rôle</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="investisseur">Investisseur</option>
                <option value="porteur">Porteur de projet</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-2 font-dm mb-2">Téléphone (optionnel)</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg border border-surface-2 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            
            <Button type="submit" variant="gold" className="w-full py-3" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>
          
          <p className="text-center text-text-2 text-sm mt-6">
            Déjà un compte ?{' '}
            <a href="/connexion" className="text-gold hover:underline">
              Se connecter
            </a>
          </p>
          
          <div className="mt-4 pt-4 border-t border-surface-2">
            <p className="text-xs text-text-3 text-center">
              📌 Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
