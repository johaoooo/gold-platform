'use client';

import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f1035',
            color: '#f0eaf8',
            border: '1px solid rgba(240, 165, 0, 0.3)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#f0a500',
              secondary: '#1f1035',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f1035',
            },
          },
        }}
      />
    </>
  );
}
