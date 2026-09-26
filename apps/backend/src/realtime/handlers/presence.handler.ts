/**
 * Handlers Socket.IO pour la présence (typing, online status).
 * Inspiré de [[skill-websocket]].
 */
import { Server, Socket } from 'socket.io';
import type { SocketEventMap } from '@nicecord/types';

const typingTimers = new Map<string, NodeJS.Timeout>();

export function registerPresenceHandlers(
  io: Server<SocketEventMap>,
  socket: Socket<SocketEventMap>
) {
  const userId = socket.data.userId!;

  // Indicateur de frappe (typing)
  socket.on('typing:start', ({ channelId }) => {
    io.to(`channel:${channelId}`).emit('typing:update', { userId, channelId, typing: true });

    // Auto-stop après 10s
    const timer = setTimeout(() => {
      io.to(`channel:${channelId}`).emit('typing:update', { userId, channelId, typing: false });
    }, 10_000);
    typingTimers.set(`${userId}:${channelId}`, timer);
  });

  socket.on('typing:stop', ({ channelId }) => {
    const key = `${userId}:${channelId}`;
    if (typingTimers.has(key)) {
      clearTimeout(typingTimers.get(key));
      typingTimers.delete(key);
    }
    io.to(`channel:${channelId}`).emit('typing:update', { userId, channelId, typing: false });
  });
}
