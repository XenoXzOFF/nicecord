/**
 * Page d'accueil — redirige vers le dashboard ou la page de login.
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      router.replace('/channels/@me');
    } else {
      router.replace('/login');
    }
  }, [token, router]);

  return (
    <main className="flex h-screen w-full items-center justify-center bg-bg-default">
      <span className="text-text-secondary">Redirection…</span>
    </main>
  );
}
