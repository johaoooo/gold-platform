'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: '/dashboard/investisseur', label: 'Tableau de bord' },
    { href: '/dashboard/investisseur/projets', label: 'Explorer' },
    { href: '/dashboard/investisseur/investissements', label: 'Mes investissements' },
  ];

  return (
    <div className="flex gap-4 mb-8 border-b border-gold/20 pb-4">
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
