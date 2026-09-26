/**
 * @nicecord/types — types partagés entre le frontend et le backend.
 *
 * Contrainte de version : garder ce package en source de vérité unique.
 * Le frontend et le backend importent ces types via le workspace npm.
 */

// ─── Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  discriminator: string;
  globalName?: string;
  avatar: string | null;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  createdAt: Date;
}

/** Public user view returned by the auth endpoints (subset of User). */
export interface AuthUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken?: string;
}

export interface LogoutResponse {
  ok: boolean;
}

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  createdAt: Date;
}

export interface GuildMember {
  id: string;
  userId: string;
  guildId: string;
  nickname?: string | null;
  roles: string[];
  joinedAt: Date;
}

export interface Channel {
  id: string;
  guildId: string;
  name: string;
  type: 'text' | 'voice' | 'category' | 'announcement';
  position: number;
  parentId?: string | null;
  createdAt: Date;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date | null;
  nonce?: string | null;
}

export interface MessageCreateDto {
  channelId: string;
  content: string;
  nonce?: string;
}

// ─── Real-time events ─────────────────────────────────────────────────

export type SocketEventMap = {
  // client → server (actions)
  'channel:join': (payload: { channelId: string }) => void;
  'channel:leave': (payload: { channelId: string }) => void;
  'message:create': (payload: MessageCreateDto) => void;
  'typing:start': (payload: { channelId: string }) => void;
  'typing:stop': (payload: { channelId: string }) => void;

  // server → client (broadcasts)
  'message:created': (payload: Message) => void;
  'message:deleted': (payload: { id: string; channelId: string }) => void;
  'typing:update': (payload: { userId: string; channelId: string; typing: boolean }) => void;
  'presence:update': (payload: {
    userId: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
    lastSeen?: Date;
  }) => void;
  'message:error': (payload: { nonce?: string; error: string }) => void;
};

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

export interface SocketError {
  code: string;
  message: string;
}

// ─── Utility types ────────────────────────────────────────────────────
export type Optional<T> = { [K in keyof T]?: T[K] };
export type Nullable<T> = T | null;
export type UUID = string & { readonly __brand: 'UUID' };
