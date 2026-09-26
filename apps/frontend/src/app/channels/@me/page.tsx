/**
 * Page Messages privés — vue @me de Discord.
 * Inspiré de [[skill-ui-discord]].
 */
'use client';

import { cn } from '@/lib/utils';

export default function DirectMessagesPage() {
  return (
    <main
      className={cn(
        'flex h-screen w-full flex-col items-center justify-center',
        'bg-bg-default text-text-secondary'
      )}
    >
      <h1 className="mb-2 text-lg font-semibold text-text-primary">
        Messages privés
      </h1>
      <p className="text-sm">
        Aucune discussion en cours. Commencez à discuter !
      </p>
    </main>
  );
}
