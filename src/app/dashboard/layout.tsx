'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification simple
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.replace('/connexion');
      return;
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-2">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-28">
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {children}
      </div>
    </div>
  );
}
