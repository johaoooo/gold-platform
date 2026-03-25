import Projets from '@/components/sections/Projets';

export default function ProjetsPage() {
  return (
    <main className="pt-20">
      <div className="bg-surface py-12 border-b border-gold/10 mb-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Titre en blanc + accent vert sur un mot */}
          <h1 className="text-4xl font-playfair text-white mb-2">
            Catalogue des <span className="text-gold">Projets</span>
          </h1>
          <p className="text-text-2">Explorez toutes les opportunités d'investissement vérifiées.</p>
        </div>
      </div>
      <Projets />
    </main>
  );
}