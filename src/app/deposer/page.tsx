'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function DeposerProjet() {
  const [etape, setEtape] = useState(1);
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <main className="pt-40 pb-20 text-center px-6">
        <div className="max-w-md mx-auto bg-surface p-10 rounded-3xl border border-gold/30 shadow-[0_0_30px_rgba(46,125,50,0.15)]">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gold text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-playfair text-white mb-4">Projet Reçu</h1>
          <p className="text-text-2 mb-8">Votre dossier a été transmis à nos experts. Vous recevrez une réponse sous 48h.</p>
          <Button variant="gold" size="md" className="w-full">Retour à l'accueil</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair text-gold mb-4">Propulser votre vision</h1>
          <p className="text-text-2">Remplissez les informations ci-dessous pour soumettre votre projet au réseau GOLD.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-surface/50 backdrop-blur-sm border border-gold/10 p-8 md:p-12 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Titre du projet */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-syne uppercase tracking-widest text-gold/80">Nom du projet</label>
              <input 
                required
                type="text" 
                placeholder="Ex: AgriTech Bénin"
                className="bg-bg border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              />
            </div>

            {/* Secteur */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-syne uppercase tracking-widest text-gold/80">Secteur d'activité</label>
              <select className="bg-bg border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition">
                <option>Technologie</option>
                <option>Agriculture</option>
                <option>Énergie</option>
                <option>Immobilier</option>
                <option>Santé</option>
              </select>
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-syne uppercase tracking-widest text-gold/80">Besoin de financement (FCFA)</label>
              <input 
                required
                type="number" 
                placeholder="Ex: 5000000"
                className="bg-bg border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              />
            </div>

            {/* Localisation */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-syne uppercase tracking-widest text-gold/80">Ville / Pays</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Cotonou, Bénin"
                className="bg-bg border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mb-10">
            <label className="text-xs font-syne uppercase tracking-widest text-gold/80">Pitch du projet</label>
            <textarea 
              required
              rows={5}
              placeholder="Décrivez votre vision et l'impact de votre projet..."
              className="bg-bg border border-gold/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
            ></textarea>
          </div>

          <Button variant="gold" size="lg" className="w-full py-4 text-lg">
            Soumettre le dossier
          </Button>
        </form>
      </div>
    </main>
  );
}
