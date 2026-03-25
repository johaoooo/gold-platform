'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PorteurTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: '/dashboard/porteur', label: 'Tableau de bord' },
    { href: '/dashboard/porteur/projets', label: 'Mes projets' },
    { href: '/dashboard/porteur/investissements', label: 'Investissements reçus' },
    { href: '/dashboard/porteur/nouveau-projet', label: 'Nouveau projet' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8 border-b border-gold/20 pb-4">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`pb-2 transition-colors ${
            pathname === tab.href
              ? 'text-gold font-semibold border-b-2 border-gold'
              : 'text-text-2 hover:text-gold'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
