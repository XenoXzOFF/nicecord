/**
 * Client API d'authentification — wrapper Fetch.
 * Inspiré de [[skill-websocket]] pour la gestion des tokens.
 */
import type {
  LoginPayload,
  LoginResponse,
  RefreshPayload,
  RefreshResponse,
  LogoutPayload,
  LogoutResponse,
} from '@nicecord/types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleResponse<LoginResponse>(res);
}

export async function refresh(payload: RefreshPayload): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleResponse<RefreshResponse>(res);
}

export async function logout(payload?: LogoutPayload): Promise<LogoutResponse> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleResponse<LogoutResponse>(res);
}
