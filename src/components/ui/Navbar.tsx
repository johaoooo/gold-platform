'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

function GoldenLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-1">
      <span className="font-syne text-white tracking-[0.35em] text-[15px] font-light">GOLDEN</span>
      <div className="flex items-center gap-2">
        <div className="w-7 h-px bg-gradient-to-r from-transparent to-gold opacity-80" />
        <span className="font-syne text-gold tracking-[0.3em] text-[10px]">INVEST</span>
        <div className="w-7 h-px bg-gradient-to-l from-transparent to-gold opacity-80" />
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen]         = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/processus', label: 'Processus' },
    { href: '/projets',   label: 'Projets'   },
    { href: '/profils',   label: 'Réseau'    },
    { href: '/contact',   label: 'Contact'   },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (pathname.startsWith('/dashboard')) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 px-4 md:px-6 ${
        isScrolled
          ? 'bg-bg/95 backdrop-blur-2xl border-b border-gold/10 py-3 shadow-lg shadow-black/30'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <GoldenLogo />

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12px] font-syne uppercase tracking-[0.2em] px-5 py-2 rounded-full border transition-all duration-300
                  ${pathname === item.href
                    ? 'text-bg bg-gold border-gold font-bold'
                    : 'text-white/60 border-transparent hover:text-white hover:bg-gold/10 hover:border-gold/30'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ACTIONS DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[12px] font-syne uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all px-4 py-2 rounded-full border border-transparent hover:border-white/20">
              Connexion
            </Link>
            <Link href="/deposer" className="px-6 py-2.5 text-[11px] font-syne font-bold uppercase tracking-wider rounded-full bg-gold text-bg hover:bg-gold-light transition-all">
              Commencer
            </Link>
          </div>

          {/* MOBILE DROITE : Connexion + Burger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="text-[11px] font-syne uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all px-3 py-2 rounded-full border border-white/10 hover:border-white/30"
            >
              Connexion
            </Link>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative z-[110] text-white hover:text-gold transition-colors p-2 touch-manipulation"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center gap-5 md:hidden">

          {/* BOUTON FERMER en haut à droite */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-4 z-[110] text-white/50 hover:text-white transition-colors p-2 touch-manipulation"
            aria-label="Fermer le menu"
          >
            <X size={28} />
          </button>

          <div className="mb-4">
            <GoldenLogo />
          </div>

          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`w-64 text-center text-sm font-syne uppercase tracking-[0.3em] px-8 py-4 rounded-full border transition-all duration-300
                ${pathname === item.href
                  ? 'text-bg bg-gold border-gold font-bold'
                  : 'text-white/70 border-white/10 hover:text-white hover:bg-gold/10 hover:border-gold/30'
                }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="w-48 h-px bg-white/10 my-2" />

          <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-syne uppercase tracking-[0.2em] text-white/60 hover:text-white transition py-2">
            Connexion
          </Link>
          <Link href="/deposer" onClick={() => setIsOpen(false)} className="w-64 text-center px-10 py-4 text-[12px] font-syne font-bold uppercase tracking-wider rounded-full bg-gold text-bg hover:bg-gold-light transition-all">
            Commencer
          </Link>
        </div>
      )}
    </>
  );
}
