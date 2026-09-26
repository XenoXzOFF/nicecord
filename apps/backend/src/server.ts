/**
 * Point d'entrée du serveur backend — Nicecord.
 * Inspiré de [[skill-websocket]] pour la gestion Socket.IO.
 */
import http from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import express from 'express';

import { createSocketServer } from './realtime/io';
import { json, urlencoded } from 'body-parser';
import { authRouter } from './api/auth/auth.router';
import { guildRouter } from './api/guilds/guild.router';
import { channelRouter } from './api/channels/channel.router';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// ─── Middleware ──────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);
app.use(helmet());
app.use(json({ limit: '1mb' }));
app.use(urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60_000, max: 100 }));

// ─── API REST ────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/guilds', guildRouter);
app.use('/api/v1/channels', channelRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── WebSocket ───────────────────────────────
const io = createSocketServer(httpServer);

const PORT = process.env.PORT ?? 4000;
httpServer.listen(PORT, () => {
  console.log(`[backend] HTTP + Socket.IO listening on :${PORT}`);
});

export { app, io };
