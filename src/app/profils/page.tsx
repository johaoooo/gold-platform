import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Users, Award, Briefcase, Star, ArrowRight, Mail, Linkedin, Twitter } from 'lucide-react';

interface Profil {
  id: number;
  nom: string;
  role: string;
  specialite: string;
  description: string;
  experience?: string;
  projects?: number;
}

const membres: Profil[] = [
  {
    id: 1,
    nom: "Ansbert Abalot",
    role: "Expert en Cybersécurité",
    specialite: "Audit & Infrastructure",
    description: "Spécialiste de la sécurisation des systèmes critiques et de la protection des données.",
    experience: "12+ ans",
    projects: 45
  },
  {
    id: 2,
    nom: "Dehazounde A. Joseph",
    role: "Ingénieur Cybersécurité",
    specialite: "Fullstack Developer",
    description: "Expert en développement sécurisé et déploiement de solutions SIEM/SOC.",
    experience: "8+ ans",
    projects: 32
  },
  {
    id: 3,
    nom: "Sophie Kouamé",
    role: "Business Angel",
    specialite: "AgriTech & Énergie",
    description: "Investisseuse stratégique focalisée sur les projets à fort impact social en Afrique de l'Ouest.",
    experience: "15+ ans",
    projects: 28
  }
];

export default function ProfilsPage() {
  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <Users size={14} className="text-green-500" />
            <span className="text-xs uppercase tracking-wider text-green-500 font-semibold">Notre communauté</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Le <span className="text-green-500">Réseau</span> Golden
          </h1>
          <p className="text-text-2 max-w-2xl mx-auto text-sm md:text-base">
            Rencontrez les experts et investisseurs qui font bouger les lignes du continent.
          </p>
        </div>

        {/* Grille des membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {membres.map((m) => (
            <div key={m.id} className="group bg-gradient-to-br from-surface/80 to-surface/40 rounded-2xl p-6 border border-green-500/10 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2">
              
              {/* Avatar avec icône */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center text-green-500 font-black text-2xl border-2 border-green-500/30 mx-auto">
                  {m.nom.charAt(0)}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500/20 px-2 py-0.5 rounded-full">
                  <span className="text-[10px] text-green-400 font-bold">{m.experience}</span>
                </div>
              </div>

              {/* Infos */}
              <div className="text-center">
                <h3 className="text-xl font-black text-white mb-1 group-hover:text-green-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {m.nom}
                </h3>
                <p className="text-green-500 text-xs font-bold uppercase tracking-widest mb-3">{m.role}</p>
                
                {/* Badge spécialité */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Briefcase size={10} className="text-green-500" />
                  <span className="text-[10px] text-text-2">{m.specialite}</span>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-green-500 font-black text-lg">{m.projects}</div>
                    <div className="text-[10px] text-text-2 uppercase tracking-wider">Projets</div>
                  </div>
                  <div className="w-px h-8 bg-green-500/20" />
                  <div className="text-center">
                    <div className="text-green-500 font-black text-lg">
                      <Star size={14} className="inline text-yellow-500" /> 4.9
                    </div>
                    <div className="text-[10px] text-text-2 uppercase tracking-wider">Note</div>
                  </div>
                </div>

                <p className="text-text-2 text-sm leading-relaxed mb-6 line-clamp-3">
                  {m.description}
                </p>

                {/* Boutons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                    Voir le profil
                  </Button>
                  <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-2 hover:text-green-500 hover:border-green-500 transition-all">
                    <Mail size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Devenir membre */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/5 to-transparent blur-xl" />
          <div className="relative p-8 md:p-12 rounded-3xl border border-green-500/10 bg-surface/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Award size={24} className="text-green-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Rejoignez le réseau <span className="text-green-500">Golden</span>
            </h2>
            <p className="text-text-2 text-sm mb-6 max-w-lg mx-auto">
              Devenez membre de notre communauté d'experts et d'investisseurs engagés pour l'Afrique.
            </p>
            <Link href="/inscription">
              <button className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-green-500 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:bg-green-600">
                Postuler maintenant
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
