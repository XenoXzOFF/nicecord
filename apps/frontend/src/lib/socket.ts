/**
 * Client Socket.IO — wrapper singleton.
 * Inspiré de [[skill-websocket]].
 */
import { io, Socket } from 'socket.io-client';
import type { SocketEventMap } from '@nicecord/types';
import { useAuthStore } from '@/store/auth';

let socket: Socket<SocketEventMap> | null = null;

export function getSocket(): Socket<SocketEventMap> | null {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => console.log('[socket] connected'));
    socket.on('disconnect', (reason) => console.log('[socket] disconnected:', reason));
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
