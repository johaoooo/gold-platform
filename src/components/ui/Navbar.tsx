'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

function GoldenLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-1">
      <span className="text-white tracking-[0.35em] text-[15px] font-black" style={{ fontFamily: 'Georgia, serif' }}>
        GOLDEN
      </span>
      <div className="flex items-center gap-2">
        <div className="w-7 h-px bg-gradient-to-r from-transparent to-gold opacity-80" />
        <span className="text-gold tracking-[0.3em] text-[10px] font-black" style={{ fontFamily: 'Georgia, serif' }}>
          INVEST
        </span>
        <div className="w-7 h-px bg-gradient-to-l from-transparent to-gold opacity-80" />
      </div>
    </Link>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/processus', label: 'Processus' },
    { href: '/projets', label: 'Projets' },
    { href: '/profils', label: 'Réseau' },
    { href: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 px-4 md:px-6 ${
        isScrolled
          ? 'bg-bg/95 backdrop-blur-2xl border-b border-gold/10 py-3 shadow-lg shadow-black/30'
          : 'bg-black/70 backdrop-blur-md py-5 border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <GoldenLogo />

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12px] uppercase tracking-[0.2em] px-5 py-2 rounded-full border transition-all duration-300 font-black ${
                  pathname === item.href
                    ? 'text-bg bg-gold border-gold'
                    : 'text-white border-transparent hover:text-white hover:bg-gold/10 hover:border-gold/30'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Bouton thème */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 text-[12px] uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-all px-3 py-2 rounded-full border border-transparent hover:border-white/20"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
            </button>

            {user ? (
              <>
                <Link
                  href={user.role === 'investisseur' ? '/dashboard/investisseur' : '/dashboard/porteur'}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-2 border border-gold/20 hover:bg-gold/20 transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <User size={14} className="text-gold" />
                  <span className="text-xs text-white font-black">{user.username}</span>
                  <span className="text-[10px] text-gold uppercase font-black">
                    {user.role === 'investisseur' ? 'Invest' : 'Porteur'}
                  </span>
                </Link>
                <Link
                  href="/profil"
                  className="text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold transition-all px-4 py-2 rounded-full border border-transparent hover:border-gold/20 font-black"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white/60 hover:text-red-400 transition-all px-4 py-2 rounded-full border border-transparent hover:border-red-500/30 hover:bg-red-500/10 font-black"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold transition-all px-4 py-2 rounded-full border border-transparent hover:border-white/20 font-black"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full bg-gold text-bg hover:bg-gold-light transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-all px-3 py-2 rounded-full border border-white/10 hover:border-white/30"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {!user && (
              <Link
                href="/connexion"
                className="text-[11px] uppercase tracking-[0.2em] text-white hover:text-white transition-all px-3 py-2 rounded-full border border-white/10 hover:border-white/30 font-black"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Connexion
              </Link>
            )}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative z-[110] text-white hover:text-gold transition-colors p-2 touch-manipulation"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center gap-5 md:hidden">
          <button onClick={() => setIsOpen(false)} className="absolute top-5 right-4 z-[110] text-white/50 hover:text-white p-2">
            <X size={28} />
          </button>
          <div className="mb-4"><GoldenLogo /></div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-2 border border-gold/20 hover:bg-gold/20 transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {theme === 'dark' ? <Sun size={16} className="text-gold" /> : <Moon size={16} className="text-gold" />}
            <span className="text-white font-black">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
          </button>

          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`w-64 text-center text-sm uppercase tracking-[0.3em] px-8 py-4 rounded-full border transition-all duration-300 font-black ${
                pathname === item.href
                  ? 'text-bg bg-gold border-gold'
                  : 'text-white/70 border-white/10 hover:text-white hover:bg-gold/10 hover:border-gold/30'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {item.label}
            </Link>
          ))}

          <div className="w-48 h-px bg-white/10 my-2" />

          {user ? (
            <>
              <Link
                href={user.role === 'investisseur' ? '/dashboard/investisseur' : '/dashboard/porteur'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-2 border border-gold/20 hover:bg-gold/20 transition-all"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <User size={16} className="text-gold" />
                <span className="text-sm text-white font-black">{user.username}</span>
                <span className="text-[10px] text-gold uppercase font-black">
                  {user.role === 'investisseur' ? 'Invest' : 'Porteur'}
                </span>
              </Link>
              <Link
                href="/profil"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-white hover:text-gold transition py-2 font-black"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Mon profil
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60 hover:text-red-400 transition py-2 font-black"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/connexion" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition py-2 font-black" style={{ fontFamily: 'Georgia, serif' }}>
                Connexion
              </Link>
              <Link href="/inscription" onClick={() => setIsOpen(false)} className="w-64 text-center px-10 py-4 text-[12px] font-black uppercase tracking-wider rounded-full bg-gold text-bg hover:bg-gold-light transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                Commencer
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
