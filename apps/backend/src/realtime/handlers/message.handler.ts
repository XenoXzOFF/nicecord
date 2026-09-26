/**
 * Handlers Socket.IO pour les messages de salon textuel.
 * Inspiré de [[skill-websocket]].
 */
import { Server, Socket } from 'socket.io';
import type { SocketEventMap, Message } from '@nicecord/types';

export function registerMessageHandlers(
  io: Server<SocketEventMap>,
  socket: Socket<SocketEventMap>
) {
  const userId = socket.data.userId!;

  // Rejoindre un salon textuel
  socket.on('channel:join', ({ channelId }) => {
    socket.join(`channel:${channelId}`);
    socket.data.currentChannel = channelId;
  });

  // Quitter un salon
  socket.on('channel:leave', ({ channelId }) => {
    socket.leave(`channel:${channelId}`);
  });

  // Envoi d'un message
  socket.on('message:create', async ({ channelId, content, nonce }) => {
    if (!content.trim() || content.length > 2000) {
      socket.emit('message:error', { nonce, error: 'Message invalide' });
      return;
    }

    // TODO: vérifier l'accès au salon (checkChannelAccess)

    const message: Message = {
      id: crypto.randomUUID(),
      channelId,
      authorId: userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      nonce: nonce ?? null,
    };

    // TODO: persister en DB

    io.to(`channel:${channelId}`).emit('message:created', message);
  });
}
