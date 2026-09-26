# Contrat d'API — Authentification

*Source de vérité : `packages/types/src/index.ts`*

## Endpoints REST

### POST `/api/v1/auth/login`
Authentifie un utilisateur et retourne le JWT.

**Request body** :
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Réponse 200** :
```json
{
  "token": "<jwt-access-token>",
  "refreshToken": "<jwt-refresh-token>",
  "user": { "id": "...", "username": "...", "avatar": "..." }
}
```

**Réponse 401** : `{ "error": "Invalid credentials" }`

---

### POST `/api/v1/auth/refresh`
Échange un refresh-token contre un nouveau access-token.

### POST `/api/v1/auth/logout`
Invalide le refresh-token côté serveur (ou client uniquement).

## Socket.IO
Le token JWT est passé via `socket.handshake.auth.token` :

```ts
const socket = io(URL, {
  auth: { token: localStorage.getItem('accessToken') },
  transports: ['websocket'],
});
```

Le serveur valide le token via le middleware `auth.middleware.ts` avant tout
événement.
