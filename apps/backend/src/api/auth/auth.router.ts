/**
 * Router d'authentification — JWT.
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import type { AuthUser, LoginPayload, LoginResponse, RefreshPayload, RefreshResponse, LogoutPayload, LogoutResponse } from '@nicecord/types';

const router = Router();

// ─── Schémas de validation ──────────────────────────────────────────
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional(),
  }),
});

// ─── Mock credentials — remplacer par DB en production ──────────────
const MOCK_USER: AuthUser = {
  id: 'mock-user-123',
  username: 'MockUser',
  avatar: null,
};

/** Credentials valides pour le stub (remplacé par une vérif DB). */
const MOCK_CREDENTIALS = {
  email: 'user@example.com',
  password: 'secret',
};

const JWT_ACCESS_EXPIRES = '15m';
const JWT_REFRESH_EXPIRES = '7d';

function generateTokens(sub: string): { token: string; refreshToken: string } {
  const token = jwt.sign({ sub }, process.env.JWT_SECRET!, { expiresIn: JWT_ACCESS_EXPIRES });
  const refreshToken = jwt.sign({ sub }, process.env.JWT_SECRET!, { expiresIn: JWT_REFRESH_EXPIRES });
  return { token, refreshToken };
}

// ─── POST /api/v1/auth/login ────────────────────────────────────────
router.post('/login', (req, res) => {
  const parse = loginSchema.safeParse(req);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });

  const credentials: LoginPayload = parse.data.body;

  // TODO: vérifier les credentials en DB
  if (
    credentials.email !== MOCK_CREDENTIALS.email ||
    credentials.password !== MOCK_CREDENTIALS.password
  ) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { token, refreshToken } = generateTokens(MOCK_USER.id);

  const response: LoginResponse = {
    token,
    refreshToken,
    user: MOCK_USER,
  };

  return res.json(response);
});

// ─── POST /api/v1/auth/refresh ──────────────────────────────────────
router.post('/refresh', (req, res) => {
  const parse = refreshSchema.safeParse(req);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });

  const body: RefreshPayload = parse.data.body;

  try {
    const payload = jwt.verify(body.refreshToken, process.env.JWT_SECRET!) as { sub: string };
    const { token, refreshToken } = generateTokens(payload.sub);
    const response: RefreshResponse = { token, refreshToken };
    return res.json(response);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ─── POST /api/v1/auth/logout ───────────────────────────────────────
router.post('/logout', (req, res) => {
  const parse = logoutSchema.safeParse(req);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });

  const body: LogoutPayload = parse.data.body;

  // TODO: invalider le refresh-token côté serveur (Redis blocklist)
  void body; // acknowledge — placeholder until DB/Redis invalidation is wired

  const response: LogoutResponse = { ok: true };
  return res.json(response);
});

export { router as authRouter };
