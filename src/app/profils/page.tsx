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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Le <span className="text-green-400">Réseau</span> Golden
          </h1>
          <p className="text-text-2 max-w-2xl mx-auto">
            Rencontrez les experts et investisseurs qui font bouger les lignes du continent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {membres.map((m) => (
            <div key={m.id} className="bg-surface p-8 rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all group">
              <div className="w-16 h-16 bg-green-500/10 rounded-full mb-6 flex items-center justify-center text-green-400 font-bold text-xl border border-green-500/20">
                {m.nom.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition" style={{ fontFamily: 'Georgia, serif' }}>{m.nom}</h3>
              <p className="text-green-400 text-xs font-syne uppercase tracking-widest mb-4">{m.role}</p>
              <div className="mb-6">
                <span className="text-[10px] bg-white/5 text-text-2 px-3 py-1 rounded-full border border-white/10">{m.specialite}</span>
              </div>
              <p className="text-text-2 text-sm leading-relaxed mb-8 opacity-80">{m.description}</p>
              <Button variant="outline" size="sm" className="w-full">Voir le profil complet</Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
