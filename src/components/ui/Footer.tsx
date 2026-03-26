import Link from 'next/link';
import Button from './Button';

function GoldenLogo() {
  return (
    <Link href="/" className="flex flex-col items-start gap-1">
      <span className="font-syne text-white tracking-[0.35em] text-[20px] font-light">GOLDEN</span>
      <div className="flex items-center gap-2">
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold opacity-80" />
        <span className="font-syne text-gold tracking-[0.3em] text-[12px]">INVEST</span>
        <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold opacity-80" />
      </div>
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Plateforme',
      links: [
        { label: 'Comment ça marche', href: '/processus' },
        { label: 'Projets', href: '/projets' },
        { label: 'Réseau', href: '/profils' },
        { label: 'Témoignages', href: '/temoignages' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Support', href: '/contact' },
        { label: 'Mentions légales', href: '/mentions' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'contact@golden-invest.com', href: 'mailto:contact@golden-invest.com', isEmail: true },
        { label: '+229 01 23 45 67', href: 'tel:+22901234567' },
        { label: 'Cotonou, Bénin', href: 'https://maps.google.com' },
      ],
    },
  ];

  const socials = [
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '🔗', href: 'https://linkedin.com' },
    { name: 'Instagram', icon: '📸', href: 'https://instagram.com' },
    { name: 'WhatsApp', icon: '💬', href: 'https://whatsapp.com' },
  ];

  return (
    <footer className="bg-gradient-to-b from-bg to-bg/95 border-t border-green-500/20 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo + Description */}
          <div className="lg:col-span-2">
            <GoldenLogo />
            <p className="text-text-2 text-sm leading-relaxed mt-6 max-w-sm">
              Connecter les visionnaires aux capitaux. La plateforme de référence pour l'investissement en Afrique.
            </p>
            <div className="flex gap-4 mt-6">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-xl hover:bg-gold hover:text-surface transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Liens */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-gold font-bold uppercase text-sm tracking-wider mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-text-2 hover:text-gold transition-colors text-sm ${
                        link.isEmail ? 'hover:underline' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-green-500/20 pt-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-text-2 text-sm">
              Restez informé des nouveaux projets et opportunités
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 bg-surface-2 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
              />
              <Button variant="gold" size="sm">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-500/20 pt-8 text-center">
          <p className="text-text-3 text-xs tracking-wider">
            © {currentYear} GOLDEN INVEST — Tous droits réservés
          </p>
          <p className="text-text-3 text-[10px] mt-2">
            Fait avec passion pour l'Afrique
          </p>
        </div>
      </div>
    </footer>
  );
}
