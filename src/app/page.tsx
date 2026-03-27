'use client';

import { useState } from 'react';
import TerminalLoader from '@/components/ui/TerminalLoader';
import HomeContent from './HomeContent';

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {showLoader && <TerminalLoader onComplete={handleLoaderComplete} />}
      {!showLoader && <HomeContent />}
    </>
  );
}
