import Button from '@/components/ui/Button';

export default function ProcessusPage() {
  const etapes = [
    { num: "01", titre: "Inscription & KYC", desc: "Créez votre compte en quelques clics. Pour les investisseurs, une vérification d'identité (KYC) est nécessaire pour garantir la conformité et la sécurité des transactions." },
    { num: "02", titre: "Soumission / Exploration", desc: "Porteurs de projets : soumettez votre pitch deck et vos prévisions financières. Investisseurs : parcourez les projets vérifiés par notre comité de sélection." },
    { num: "03", titre: "Mise en relation", desc: "Accédez à une dataroom sécurisée pour consulter les documents confidentiels. Échangez avec les fondateurs via notre interface de messagerie chiffrée." },
    { num: "04", titre: "Investissement", desc: "Signez les documents juridiques électroniquement et transférez les fonds via nos partenaires bancaires sécurisés. Le suivi est assuré par GOLDEN INVEST." }
  ];

  const faqs = [
    { q: "Quels sont les critères de sélection ?", a: "Nous analysons la viabilité du business model, l'expérience de l'équipe et l'impact potentiel sur le marché local." },
    { q: "Est-ce sécurisé ?", a: "Toutes les données sont chiffrées et les transactions passent par des institutions financières certifiées." },
    { q: "Combien ça coûte ?", a: "Le dépôt de projet est gratuit. Une commission est prélevée uniquement lors de la réussite de la levée de fonds." }
  ];

  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-4xl mx-auto px-6">

        {/* Titre — suppression de text-gold, passage en blanc + accent vert */}
        <h1 className="text-4xl md:text-6xl font-playfair text-white mb-8 text-center">
          Un processus <span className="text-gold">d'excellence</span>
        </h1>
        <p className="text-text-2 text-center mb-16 max-w-2xl mx-auto">
          Découvrez comment nous simplifions l'accès au capital pour les entrepreneurs et l'accès aux opportunités pour les investisseurs.
        </p>

        {/* Timeline des étapes */}
        <div className="space-y-12 mb-32">
          {etapes.map((e) => (
            <div key={e.num} className="flex gap-8 items-start border-l border-gold/20 pl-8 relative group">
              {/* Point vert — shadow rgba vert au lieu de l'or */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gold rounded-full shadow-[0_0_10px_rgba(46,125,50,0.6)] group-hover:scale-125 transition-transform" />
              <div>
                <span className="text-gold font-syne font-bold text-xl">{e.num}</span>
                <h3 className="text-2xl text-white font-playfair mt-2 mb-4 group-hover:text-gold transition-colors">{e.titre}</h3>
                <p className="text-text-2 leading-relaxed opacity-80">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-surface p-10 rounded-3xl border border-gold/10">
          <h2 className="text-3xl font-playfair text-white mb-10 text-center">Questions Fréquentes</h2>
          <div className="grid gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gold/10 pb-6 last:border-0 last:pb-0">
                {/* Question en blanc au lieu de jaune */}
                <h4 className="text-white font-syne mb-3 font-bold flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.q}
                </h4>
                <p className="text-text-2 text-sm leading-relaxed pl-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}