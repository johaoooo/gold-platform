'use client';

import { useState } from 'react';
import Button from '../ui/Button';

type Secteur = 'tous' | 'tech' | 'agriculture' | 'immobilier' | 'energie' | 'sante';

interface Projet {
  id: number;
  titre: string;
  secteur: Exclude<Secteur, 'tous'>;
  montant: string;
  localisation: string;
  description: string;
  image: string;
}

const projets: Projet[] = [
  { id: 1, titre: 'AgriTech Bénin', secteur: 'agriculture', montant: '500 000 FCFA', localisation: 'Cotonou, Bénin', description: 'Plateforme IoT pour agriculteurs.', image: '#' },
  { id: 2, titre: 'SolarHub', secteur: 'energie', montant: '1 200 000 FCFA', localisation: 'Dakar, Sénégal', description: 'Énergie solaire rurale.', image: '#' },
  { id: 3, titre: 'ImmoFacile', secteur: 'immobilier', montant: '800 000 FCFA', localisation: 'Abidjan, CI', description: 'Visites virtuelles immobilières.', image: '#' },
  { id: 4, titre: 'E-Santé Africa', secteur: 'sante', montant: '2 000 000 FCFA', localisation: 'Yaoundé, Cameroun', description: 'Télémédecine mobile.', image: '#' },
  { id: 5, titre: 'EdTech Plus', secteur: 'tech', montant: '950 000 FCFA', localisation: 'Ouagadougou, BF', description: 'Cours en ligne certifiants.', image: '#' },
  { id: 6, titre: 'Green Agro', secteur: 'agriculture', montant: '1 500 000 FCFA', localisation: 'Bamako, Mali', description: 'Engrais bio-organiques.', image: '#' },
];

const secteurs: { value: Secteur; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'tech', label: 'Tech' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'energie', label: 'Énergie' },
  { value: 'sante', label: 'Santé' },
];

export default function Projets() {
  const [secteurActif, setSecteurActif] = useState<Secteur>('tous');

  const projetsFiltres = secteurActif === 'tous' 
    ? projets 
    : projets.filter((p) => p.secteur === secteurActif);

  return (
    <section className="py-24 bg-bg" id="projets">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair text-gold mb-4">Projets à financer</h2>
          <p className="text-text-2 font-dm">Opportunités d'investissement en Afrique francophone.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {secteurs.map((s) => (
            <button
              key={s.value}
              onClick={() => setSecteurActif(s.value)}
              className={`px-6 py-2 rounded-full font-syne text-sm transition-all ${
                secteurActif === s.value ? 'bg-gold text-bg font-bold' : 'bg-surface-2 text-text-2 border border-gold/10'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projetsFiltres.map((p) => (
            <div key={p.id} className="bg-surface-2/30 border border-gold/5 rounded-2xl p-6 hover:border-gold/30 transition-all group">
              <div className="flex justify-between mb-4">
                 <span className="text-[10px] uppercase tracking-widest bg-gold/10 text-gold px-2 py-1 rounded">{p.secteur}</span>
                 <span className="text-text-2 text-xs">📍 {p.localisation}</span>
              </div>
              <h3 className="text-xl font-playfair text-white mb-2 group-hover:text-gold">{p.titre}</h3>
              <p className="text-text-2 text-sm mb-6 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gold/10">
                <span className="text-gold font-bold">{p.montant}</span>
                <Button variant="outline" size="sm">Détails</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
