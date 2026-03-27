'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<string, Record<string, string>> = {
  fr: {
    'nav.processus': 'Processus',
    'nav.projets': 'Projets',
    'nav.reseau': 'Réseau',
    'nav.contact': 'Contact',
    'nav.connexion': 'Connexion',
    'nav.commencer': 'Commencer',
    'nav.mon_profil': 'Mon profil',
    'nav.deconnexion': 'Déconnexion',
    'hero.title': "L'investissement stratégique en Afrique",
    'hero.subtitle': 'Golden Invest connecte les porteurs de projets innovants aux investisseurs visionnaires pour bâtir l\'économie de demain.',
    'hero.explore': 'Explorer les projets',
    'hero.create_account': 'Créer un compte',
    'stats.projects': 'Projets financés',
    'stats.invested': 'FCFA investis',
    'stats.return': 'Rendement moyen',
    'stats.satisfaction': 'Taux de satisfaction',
  },
  en: {
    'nav.processus': 'Process',
    'nav.projets': 'Projects',
    'nav.reseau': 'Network',
    'nav.contact': 'Contact',
    'nav.connexion': 'Login',
    'nav.commencer': 'Get Started',
    'nav.mon_profil': 'My Profile',
    'nav.deconnexion': 'Logout',
    'hero.title': 'Strategic Investment in Africa',
    'hero.subtitle': 'Golden Invest connects innovative project owners with visionary investors to build tomorrow\'s economy.',
    'hero.explore': 'Explore Projects',
    'hero.create_account': 'Create Account',
    'stats.projects': 'Funded Projects',
    'stats.invested': 'FCFA Invested',
    'stats.return': 'Average Return',
    'stats.satisfaction': 'Satisfaction Rate',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fr');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (!isClient) return key;
    return translations[language][key] || key;
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
