import Button from '@/components/ui/Button';

export default function ProcessusPage() {
  const etapes = [
    { num: "01", titre: "Inscription & KYC", desc: "Créez votre compte en quelques clics. Pour les investisseurs, une vérification d'identité (KYC) est nécessaire pour garantir la conformité et la sécurité des transactions." },
    { num: "02", titre: "Soumission / Exploration", desc: "Porteurs de projets : soumettez votre pitch deck et vos prévisions financières. Investisseurs : parcourez les projets vérifiés par notre comité de sélection." },
    { num: "03", titre: "Mise en relation", desc: "Accédez à une dataroom sécurisée pour consulter les documents confidentiels. Échangez avec les fondateurs via notre interface de messagerie chiffrée." },
    { num: "04", titre: "Investissement", desc: "Signez les documents juridiques électroniquement et transférez les fonds via nos partenaires bancaires sécurisés. Le suivi est assuré par GOLDEN INVEST." }
  ];

  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Un <span className="text-green-400">processus</span> d'excellence
          </h1>
          <p className="text-text-2 text-center max-w-2xl mx-auto">
            Découvrez comment nous simplifions l'accès au capital pour les entrepreneurs et l'accès aux opportunités pour les investisseurs.
          </p>
        </div>

        <div className="space-y-12 mb-32">
          {etapes.map((e) => (
            <div key={e.num} className="flex gap-8 items-start border-l border-green-500/20 pl-8 relative group">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform" />
              <div>
                <span className="text-green-400 font-syne font-bold text-xl">{e.num}</span>
                <h3 className="text-2xl text-white font-bold mt-2 mb-4 group-hover:text-green-400 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>{e.titre}</h3>
                <p className="text-text-2 leading-relaxed opacity-80">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface p-10 rounded-3xl border border-green-500/10">
          <h2 className="text-3xl font-bold text-white mb-10 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Questions <span className="text-green-400">Fréquentes</span>
          </h2>
          <div className="grid gap-8">
            {[
              { q: "Quels sont les critères de sélection ?", a: "Nous analysons la viabilité du business model, l'expérience de l'équipe et l'impact potentiel sur le marché local." },
              { q: "Est-ce sécurisé ?", a: "Toutes les données sont chiffrées et les transactions passent par des institutions financières certifiées." },
              { q: "Combien ça coûte ?", a: "Le dépôt de projet est gratuit. Une commission est prélevée uniquement lors de la réussite de la levée de fonds." }
            ].map((faq, index) => (
              <div key={index} className="border-b border-green-500/10 pb-6 last:border-0 last:pb-0">
                <h4 className="text-white font-syne mb-3 font-bold flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-400/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
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
