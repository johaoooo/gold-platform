import Link from "next/link";
import Button from '@/components/ui/Button';
import { CheckCircle, Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function ProcessusPage() {
  const etapes = [
    { 
      num: "01", 
      titre: "Inscription & KYC", 
      desc: "Créez votre compte en quelques clics. Pour les investisseurs, une vérification d'identité (KYC) est nécessaire pour garantir la conformité et la sécurité des transactions.",
      icon: Shield,
      color: "from-blue-500/20 to-blue-600/5"
    },
    { 
      num: "02", 
      titre: "Soumission / Exploration", 
      desc: "Porteurs de projets : soumettez votre pitch deck et vos prévisions financières. Investisseurs : parcourez les projets vérifiés par notre comité de sélection.",
      icon: Users,
      color: "from-green-500/20 to-green-600/5"
    },
    { 
      num: "03", 
      titre: "Mise en relation", 
      desc: "Accédez à une dataroom sécurisée pour consulter les documents confidentiels. Échangez avec les fondateurs via notre interface de messagerie chiffrée.",
      icon: TrendingUp,
      color: "from-purple-500/20 to-purple-600/5"
    },
    { 
      num: "04", 
      titre: "Investissement", 
      desc: "Signez les documents juridiques électroniquement et transférez les fonds via nos partenaires bancaires sécurisés. Le suivi est assuré par GOLDEN INVEST.",
      icon: CheckCircle,
      color: "from-yellow-500/20 to-yellow-600/5"
    }
  ];

  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <span className="text-xs uppercase tracking-wider text-green-500 font-semibold">Notre méthodologie</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Un <span className="text-green-500">processus</span> d'excellence
          </h1>
          <p className="text-text-2 max-w-2xl mx-auto text-sm md:text-base">
            Découvrez comment nous simplifions l'accès au capital pour les entrepreneurs et l'accès aux opportunités pour les investisseurs.
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {etapes.map((e, index) => {
            const Icon = e.icon;
            return (
              <div key={e.num} className={`group bg-gradient-to-br ${e.color} rounded-2xl p-8 border border-white/5 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-5xl font-black text-green-500/30" style={{ fontFamily: 'Georgia, serif' }}>
                    {e.num}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                    <Icon size={24} className="text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {e.titre}
                </h3>
                <p className="text-text-2 text-sm leading-relaxed">
                  {e.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 rounded-3xl border border-green-500/10 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Questions <span className="text-green-500">Fréquentes</span>
            </h2>
            <div className="w-16 h-px bg-green-500/30 mx-auto" />
          </div>
          <div className="grid gap-6">
            {[
              { q: "Quels sont les critères de sélection ?", a: "Nous analysons la viabilité du business model, l'expérience de l'équipe et l'impact potentiel sur le marché local." },
              { q: "Est-ce sécurisé ?", a: "Toutes les données sont chiffrées et les transactions passent par des institutions financières certifiées." },
              { q: "Combien ça coûte ?", a: "Le dépôt de projet est gratuit. Une commission est prélevée uniquement lors de la réussite de la levée de fonds." }
            ].map((faq, index) => (
              <div key={index} className="group border-b border-green-500/10 pb-6 last:border-0 last:pb-0 hover:border-green-500/30 transition-all">
                <h4 className="text-white font-bold mb-3 flex items-center gap-3 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  <span className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-500 text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.q}
                </h4>
                <p className="text-text-2 text-sm leading-relaxed pl-11 group-hover:text-text-1 transition-colors">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/inscription">
            <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-green-500 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:bg-green-600">
              Commencer maintenant
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
