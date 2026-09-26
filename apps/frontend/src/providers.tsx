/**
 * Providers globaux du frontend.
 */
'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';

// Simple context pour le thème (dark par défaut — design Discord)
const ThemeContext = createContext<{ theme: 'dark' }>({ theme: 'dark' });
export const useTheme = () => useContext(ThemeContext);

export function Providers({ children }: { children: ReactNode }) {
  const [theme] = useState<'dark'>('dark');
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}
