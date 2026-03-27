'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Globe } from 'lucide-react';

function GoldenLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-1">
      <span className="text-white tracking-[0.35em] text-[20px] font-black" style={{ fontFamily: 'Georgia, serif' }}>
        GOLDEN
      </span>
      <div className="flex items-center gap-2">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-green-500 opacity-80" />
        <span className="text-green-500 tracking-[0.3em] text-[12px] font-black" style={{ fontFamily: 'Georgia, serif' }}>
          INVEST
        </span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-green-500 opacity-80" />
      </div>
    </Link>
  );
}

export default function Navbar() {
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
          ? 'bg-bg/95 backdrop-blur-2xl border-b border-green-500/10 py-3 shadow-lg shadow-black/30'
          : 'bg-black/70 backdrop-blur-md py-5 border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <GoldenLogo />

          {/* Desktop nav links - plus gros */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[16px] font-bold tracking-wide transition-all duration-300 ${
                  pathname === item.href
                    ? 'text-green-500'
                    : 'text-white/80 hover:text-green-500'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href={user.role === 'investisseur' ? '/dashboard/investisseur' : '/dashboard/porteur'}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-green-500/20 hover:bg-green-500/20 transition-all"
                >
                  <User size={14} className="text-green-500" />
                  <span className="text-sm text-white font-bold" style={{ fontFamily: 'Georgia, serif' }}>{user.username}</span>
                  <span className="text-[10px] text-green-500 uppercase font-bold">
                    {user.role === 'investisseur' ? 'Invest' : 'Porteur'}
                  </span>
                </Link>
                <Link
                  href="/profil"
                  className="text-[15px] font-bold tracking-wide text-white/80 hover:text-green-500 transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[15px] font-bold tracking-wide text-white/60 hover:text-red-400 transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="text-[15px] font-bold tracking-wide text-white/80 hover:text-green-500 transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-7 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-full bg-green-500 text-white hover:bg-green-600 transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <Link
                href="/connexion"
                className="text-[12px] font-bold uppercase text-white hover:text-green-500 transition-all px-3 py-2 rounded-full border border-white/10 hover:border-white/30"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Connexion
              </Link>
            )}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative z-[110] text-white hover:text-green-500 transition-colors p-2 touch-manipulation"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center gap-6 md:hidden">
          <button onClick={() => setIsOpen(false)} className="absolute top-5 right-4 z-[110] text-white/50 hover:text-white p-2">
            <X size={28} />
          </button>
          <div className="mb-4"><GoldenLogo /></div>

          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-bold tracking-wide transition-all duration-300 ${
                pathname === item.href
                  ? 'text-green-500'
                  : 'text-white/80 hover:text-green-500'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {item.label}
            </Link>
          ))}

          <div className="w-48 h-px bg-white/10 my-3" />

          {user ? (
            <>
              <Link
                href={user.role === 'investisseur' ? '/dashboard/investisseur' : '/dashboard/porteur'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-2 border border-green-500/20 hover:bg-green-500/20 transition-all"
              >
                <User size={18} className="text-green-500" />
                <span className="text-lg text-white font-bold" style={{ fontFamily: 'Georgia, serif' }}>{user.username}</span>
              </Link>
              <Link
                href="/profil"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold tracking-wide text-white/70 hover:text-green-500 transition py-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Mon profil
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="text-xl font-bold tracking-wide text-white/60 hover:text-red-400 transition py-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/connexion" onClick={() => setIsOpen(false)} className="text-xl font-bold tracking-wide text-white/70 hover:text-green-500 transition py-2" style={{ fontFamily: 'Georgia, serif' }}>
                Connexion
              </Link>
              <Link href="/inscription" onClick={() => setIsOpen(false)} className="px-10 py-4 text-[14px] font-bold uppercase tracking-wider rounded-full bg-green-500 text-white hover:bg-green-600 transition-all" style={{ fontFamily: 'Georgia, serif' }}>
                Commencer
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
