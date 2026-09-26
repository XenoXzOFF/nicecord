/**
 * Store d'authentification — Zustand.
 * Inspiré de [[skill-ui-discord]].
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: { id: string; username: string; avatar: string | null } | null;
  setToken: (token: string | null) => void;
  setRefresh: (refresh: string | null) => void;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setToken: (token) => set({ token }),
      setRefresh: (refresh) => set({ refreshToken: refresh }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, refreshToken: null, user: null }),
    }),
    { name: 'nicecord:auth' }
  )
);
