'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/services/api';
import PorteurTabs from '@/components/dashboard/PorteurTabs';
import Button from '@/components/ui/Button';

export default function NouveauProjetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    titre: '',
    description: '',
    secteur: 'agriculture',
    localisation: '',
    montant_cible: '',
    date_limite: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProject({
        ...form,
        montant_cible: parseFloat(form.montant_cible),
      });
      router.push('/dashboard/porteur/projets');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PorteurTabs />

      <h1 className="text-3xl font-playfair text-gold mb-2">Nouveau projet</h1>
      <p className="text-text-2 mb-6">Présentez votre projet aux investisseurs</p>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-text-2 font-dm mb-2">Titre du projet *</label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="block text-text-2 font-dm mb-2">Description *</label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-2 font-dm mb-2">Secteur *</label>
            <select
              name="secteur"
              value={form.secteur}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
            >
              <option value="agriculture">Agriculture</option>
              <option value="energie">Énergie / Solaire</option>
              <option value="immobilier">Immobilier</option>
              <option value="tech">Tech / Startup</option>
            </select>
          </div>

          <div>
            <label className="block text-text-2 font-dm mb-2">Localisation *</label>
            <input
              type="text"
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              placeholder="Ville, Pays"
              className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-2 font-dm mb-2">Montant cible (FCFA) *</label>
            <input
              type="number"
              name="montant_cible"
              value={form.montant_cible}
              onChange={handleChange}
              placeholder="ex: 50000000"
              className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="block text-text-2 font-dm mb-2">Date limite (optionnel)</label>
            <input
              type="date"
              name="date_limite"
              value={form.date_limite}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="gold" disabled={loading} className="px-8 py-3">
            {loading ? 'Création...' : 'Publier le projet'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-8 py-3"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
