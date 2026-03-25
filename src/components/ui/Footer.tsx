import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-white/10 pt-28 pb-14 px-6 font-sans relative">

      {/* Effet lumière */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gold/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

        {/* LOGO */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 border-2 border-gold rounded-full flex items-center justify-center font-bold text-gold text-lg">
              G
            </div>
            <span className="text-xl font-bold text-white uppercase tracking-wide">
              Golden <span className="text-gold">Invest</span>
            </span>
          </Link>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Plateforme d’investissement stratégique dédiée à connecter investisseurs et porteurs de projets au Bénin et en Afrique.
          </p>
        </div>

        {/* LIENS */}
        <div>
          <h4 className="text-gold mb-6 font-bold uppercase text-xs tracking-widest">
            Navigation
          </h4>
          <ul className="space-y-4 text-sm text-white/80">
            <li>
              <Link href="/projets" className="hover:text-gold transition">Projets</Link>
            </li>
            <li>
              <Link href="/processus" className="hover:text-gold transition">Méthode</Link>
            </li>
            <li>
              <Link href="/profils" className="hover:text-gold transition">Réseau</Link>
            </li>
          </ul>
        </div>

        {/* INFORMATIONS */}
        <div>
          <h4 className="text-gold mb-6 font-bold uppercase text-xs tracking-widest">
            Support
          </h4>
          <ul className="space-y-4 text-sm text-white/80">
            <li>
              <Link href="/contact" className="hover:text-gold transition">Contact</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gold transition">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* BUREAUX */}
        <div>
          <h4 className="text-gold mb-6 font-bold uppercase text-xs tracking-widest">
            Bureaux
          </h4>
          <p className="text-white/80 text-sm leading-loose">
            Cotonou - Haie Vive <br />
            Porto-Novo - Zone Admin <br />
            <span className="text-gold">contact@golden-invest.com</span>
          </p>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">

        <p className="text-gray-500 text-xs tracking-widest text-center md:text-left">
          © 2026 GOLDEN INVEST — Tous droits réservés
        </p>

        {/* Réseaux (optionnel mais stylé) */}
        <div className="flex gap-6 text-white/60 text-sm">
          <span className="hover:text-gold cursor-pointer transition">Facebook</span>
          <span className="hover:text-gold cursor-pointer transition">LinkedIn</span>
          <span className="hover:text-gold cursor-pointer transition">WhatsApp</span>
        </div>
      </div>
    </footer>
  );
}