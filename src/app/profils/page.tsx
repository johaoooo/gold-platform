import Button from '@/components/ui/Button';

interface Profil {
  id: number;
  nom: string;
  role: string;
  specialite: string;
  description: string;
}

const membres: Profil[] = [
  {
    id: 1,
    nom: "Ansbert Abalot",
    role: "Expert en Cybersécurité",
    specialite: "Audit & Infrastructure",
    description: "Spécialiste de la sécurisation des systèmes critiques et de la protection des données."
  },
  {
    id: 2,
    nom: "Dehazounde A. Joseph",
    role: "Ingénieur Cybersécurité",
    specialite: "Fullstack Developer",
    description: "Expert en développement sécurisé et déploiement de solutions SIEM/SOC."
  },
  {
    id: 3,
    nom: "Sophie Kouamé",
    role: "Business Angel",
    specialite: "AgriTech & Énergie",
    description: "Investisseuse stratégique focalisée sur les projets à fort impact social en Afrique de l'Ouest."
  }
];

export default function ProfilsPage() {
  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-7xl mx-auto px-6">

        {/* En-tête — titre en blanc, pas en or */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-playfair text-white mb-6">
            Le Réseau <span className="text-gold">Golden</span>
          </h1>
          <p className="text-text-2 max-w-2xl mx-auto">
            Rencontrez les experts et investisseurs qui font bouger les lignes du continent.
          </p>
        </div>

        {/* Grille des membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {membres.map((m) => (
            <div
              key={m.id}
              className="bg-surface p-8 rounded-2xl border border-gold/10 hover:border-gold/30 transition-all group"
            >
              {/* Avatar */}
              <div className="w-16 h-16 bg-gold/10 rounded-full mb-6 flex items-center justify-center text-gold font-bold text-xl border border-gold/20">
                {m.nom.charAt(0)}
              </div>

              {/* Nom */}
              <h3 className="text-xl font-playfair text-white mb-1 group-hover:text-gold transition">
                {m.nom}
              </h3>

              {/* Rôle — text-gold devient vert via tailwind.config */}
              <p className="text-gold text-xs font-syne uppercase tracking-widest mb-4">
                {m.role}
              </p>

              {/* Badge spécialité — bg-surface-2 remplacé par bg-white/5 */}
              <div className="mb-6">
                <span className="text-[10px] bg-white/5 text-text-2 px-3 py-1 rounded-full border border-white/10">
                  {m.specialite}
                </span>
              </div>

              {/* Description */}
              <p className="text-text-2 text-sm leading-relaxed mb-8 opacity-80">
                {m.description}
              </p>

              {/* Bouton — variant outline = bordure verte via Button.tsx corrigé */}
              <Button variant="outline" size="sm" className="w-full">
                Voir le profil complet
              </Button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}