/**
 * Page de login — formulaire d'authentification.
 * Inspiré de [[skill-ui-discord]] pour le design sombre Discord.
 */
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { login } from '@/lib/auth-api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setRefresh = useAuthStore((s) => s.setRefresh);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { token, refreshToken, user } = await login({ email, password });
      setToken(token);
      setRefresh(refreshToken);
      setUser({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      });
      router.replace('/channels/@me');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-bg-default">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-bg-secondary p-8">
        <h1 className="text-center text-2xl font-bold text-text-primary">
          Connexion à Nicecord
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              Courriel
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className={cn(
                'mt-1 w-full rounded-md bg-bg-tertiary border border-transparent',
                'px-3 py-2 text-sm text-text-primary outline-none',
                'focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
              )}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={1}
              className={cn(
                'mt-1 w-full rounded-md bg-bg-tertiary border border-transparent',
                'px-3 py-2 text-sm text-text-primary outline-none',
                'focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-status-dnd">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'mt-2 w-full rounded-md bg-primary-500 py-2 text-sm font-medium text-white',
              'hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors'
            )}
          >
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}
