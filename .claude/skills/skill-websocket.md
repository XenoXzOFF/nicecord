# Skill : WebSocket / Temps Réel

> Templates et bonnes pratiques pour la gestion des salons textuels en temps réel avec Socket.IO.

## Architecture Socket.IO

### Namespace & Rooms
```
Namespace: /realtime
  └── Rooms par salon (channelId): `channel:{channelId}`
  └── Rooms par utilisateur (pour DMs): `user:{userId}`
  └── Rooms par serveur (pour broadcasts serveur): `guild:{guildId}`
```

Chaque salon textuel possède sa propre **room Socket.IO** pour limiter la diffusion aux participants du salon.

## Templates de code — Server (Node.js)

### 1. Setup du serveur Socket.IO
```ts
// src/backend/realtime/server.ts
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { registerMessageHandlers } from './handlers/message.handler';
import { registerPresenceHandlers } from './handlers/presence.handler';
import { authMiddleware } from './middleware/auth.middleware';

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    path: '/socket.io',
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });

  // Redis adapter pour le scaling multi-instances
  io.adapter(createAdapter(redisPubClient, redisSubClient));

  // Middleware d'authentification
  io.use(authMiddleware);

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected (${socket.id})`);

    // Rejoindre les rooms automatiques
    socket.join(`user:${socket.userId}`);

    registerMessageHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} disconnected: ${reason}`);
      handleDisconnect(io, socket);
    });
  });

  return io;
}
```

### 2. Middleware d'auth
```ts
// src/backend/realtime/middleware/auth.middleware.ts
export async function authMiddleware(socket: Socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

  if (!token) return next(new Error('AUTH_ERROR'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.sub;
    next();
  } catch (err) {
    next(new Error('AUTH_ERROR'));
  }
}
```

### 3. Handler de messages (salon textuel)
```ts
// src/backend/realtime/handlers/message.handler.ts
import { Message } from '@nicecord/types';

export function registerMessageHandlers(io: Server, socket: Socket) {
  // Créer un message dans un salon
  socket.on('message:create', async ({ channelId, content, nonce }: MessageCreateDto) => {
    // Validation
    if (!content.trim() || content.length > 2000) {
      socket.emit('message:error', { nonce, error: 'Message invalide' });
      return;
    }

    // Vérifier l'accès au salon
    const hasAccess = await checkChannelAccess(socket.userId, channelId);
    if (!hasAccess) {
      socket.emit('message:error', { nonce, error: 'Accès refusé' });
      return;
    }

    // Persister en DB
    const message: Message = await db.message.create({
      data: { content, channelId, authorId: socket.userId, nonce },
    });

    // Diffuser aux membres du salon
    io.to(`channel:${channelId}`).emit('message:created', message);
  });

  // Rejoindre un salon (join channel room)
  socket.on('channel:join', async ({ channelId }: { channelId: string }) => {
    const hasAccess = await checkChannelAccess(socket.userId, channelId);
    if (!hasAccess) return;

    socket.join(`channel:${channelId}`);
    socket.data.currentChannel = channelId;

    // Marquer les messages comme lus
    await markAsRead(socket.userId, channelId);

    // Notifier la présence dans le salon
    io.to(`channel:${channelId}`).emit('presence:channelJoin', {
      userId: socket.userId,
    });
  });
}
```

### 4. Gestion de la présence (typing, seen)
```ts
export function registerPresenceHandlers(io: Server, socket: Socket) {
  socket.on('typing:start', ({ channelId }: { channelId: string }) => {
    socket.to(`channel:${channelId}`).emit('typing:update', {
      userId: socket.userId,
      channelId,
      typing: true,
    });
  });

  socket.on('typing:stop', ({ channelId }: { channelId: string }) => {
    socket.to(`channel:${channelId}`).emit('typing:update', {
      userId: socket.userId,
      channelId,
      typing: false,
    });
  });

  // Typing indicator timer (auto-stop after 10s)
  const typingTimers = new Map<string, NodeJS.Timeout>();
}
```

## Templates de code — Client (React)

### 1. Hook de connexion Socket.IO
```ts
// src/frontend/hooks/useSocket.ts
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const s: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    s.on('connect', () => console.log('Socket connected'));
    s.on('disconnect', (reason) => console.log('Socket disconnected:', reason));

    setSocket(s);

    return () => s.disconnect();
  }, [token]);

  return socket;
}
```

### 2. Envoi et réception de messages
```ts
// src/frontend/features/chat/model/useChatSocket.ts
import { useEffect } from 'react';
import { useSocketStore } from '@/store/socket';

export function useChatSocket(channelId: string) {
  const addMessage = useSocketStore((s) => s.addMessage);
  const addTypingUser = useSocketStore((s) => s.addTypingUser);
  const removeTypingUser = useSocketStore((s) => s.removeTypingUser);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Rejoindre le salon
    socket.emit('channel:join', { channelId });

    // Écouter les messages
    socket.on('message:created', (message: Message) => {
      addMessage(message);
    });

    // Écouter le typing
    socket.on('typing:update', ({ userId, typing }: TypingEvent) => {
      if (typing) addTypingUser(userId);
      else removeTypingUser(userId);
    });

    return () => {
      socket.off('message:created');
      socket.off('typing:update');
      socket.emit('channel:leave', { channelId });
    };
  }, [channelId, addMessage, addTypingUser, removeTypingUser]);
}
```

## Types partagés

```ts
// packages/types/src/index.ts
export interface Message {
  id: string;
  content: string;
  channelId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  nonce?: string;
}

export interface TypingEvent {
  userId: string;
  channelId: string;
  typing: boolean;
}

export interface Presence {
  userId: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  lastSeen?: Date;
}
```

## Bonnes pratiques
1. **Rate limiting** : limiter les messages à 10/sec par utilisateur
2. **Nonce** : générer côté client pour l'optimistic UI puis matcher au message serveur
3. **Optimistic UI** : afficher le message localement avant l'accusé de réception serveur
4. **Reconnexion** : garder les messages dans un buffer local et les rejouer à la reconnexion
5. **Cleanup** : quitter les rooms (`channel:leave`) à la navigation

## Rate limiting côté serveur
```ts
const rateLimit = new Map<string, { count: number; reset: number }>();
const MESSAGE_LIMIT = 10; // messages
const WINDOW_MS = 10_000; // 10 secondes
```

---

*Ce skill décrit le protocole réseau entre le frontend et le backend de Nicecord.*
