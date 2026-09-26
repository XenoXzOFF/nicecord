/**
 * Middleware Socket.IO — authentifie via JWT.
 * Inspiré de [[skill-websocket]] / ADR-001.
 */
import jwt from 'jsonwebtoken';
import type { Socket } from 'socket.io';

export async function authMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers.authorization?.toString().split(' ')[1];

  if (!token) return next(new Error('AUTH_ERROR'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    socket.data.userId = payload.sub;
    next();
  } catch {
    next(new Error('AUTH_ERROR'));
  }
}
