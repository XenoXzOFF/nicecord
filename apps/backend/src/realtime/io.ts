/**
 * Serveur Socket.IO — logique temps réel.
 * Inspiré de [[skill-websocket]].
 */
import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import type { SocketEventMap } from '@nicecord/types';

import { config } from '../config';
import { authMiddleware } from './middleware/auth.middleware';
import { registerMessageHandlers } from './handlers/message.handler';
import { registerPresenceHandlers } from './handlers/presence.handler';

/**
 * Fabrique et configure le serveur Socket.IO.
 * Les rooms sont nommées `channel:{id}`.
 */
export function createSocketServer(httpServer: HttpServer): Server<SocketEventMap> {
  const io = new Server<SocketEventMap>(httpServer, {
    path: '/socket.io',
    cors: {
      origin: config.frontendUrl,
      credentials: true,
    },
  });

  // Middleware global d'authentification JWT
  io.use(authMiddleware);

  io.on('connection', (socket: Socket<SocketEventMap>) => {
    console.log(`[socket] user ${socket.data.userId} connected`);

    // Rejoindre la room personnelle de l'utilisateur
    socket.join(`user:${socket.data.userId}`);

    registerMessageHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`[socket] user ${socket.data.userId} disconnected: ${reason}`);
    });
  });

  return io;
}
