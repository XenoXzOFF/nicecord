/**
 * Page "Messages privés" — page d'accueil post-connexion.
 * Page de garde affichée après redirect depuis app/page.tsx et login/page.tsx.
 * Inspiré de [[skill-ui-discord]] pour le thème sombre Discord.
 */
'use client';

import { cn } from '@/lib/utils';

export default function PrivateMessagesPage() {
  return (
    <main
      className={cn(
        'flex h-screen w-full flex-col items-center justify-center',
        'bg-bg-default'
      )}
    >
      <h1 className="mb-2 text-3xl font-semibold text-text-primary">
        Messages privés
      </h1>
      <p className="text-sm text-text-secondary">
        Aucun message pour le moment.
      </p>
    </main>
  );
}
