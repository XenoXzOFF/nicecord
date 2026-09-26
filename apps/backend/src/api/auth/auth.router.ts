/**
 * Router d'authentification — JWT.
 * (stub minimal, à compléter par l'agent backend-realtime)
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';

const router = Router();
const loginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string() }) });

router.post('/login', (req, res) => {
  const parse = loginSchema.safeParse(req);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });

  // TODO: vérifier les credentials en DB
  const token = jwt.sign({ sub: 'mock' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return res.json({ token });
});

router.post('/logout', (_req, res) => {
  res.json({ ok: true });
});

router.post('/refresh', (_req, res) => {
  res.json({ token: jwt.sign({ sub: 'mock' }, process.env.JWT_SECRET!, { expiresIn: '7d' }) });
});

export { router as authRouter };
