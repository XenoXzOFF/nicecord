# Contrat d'API — Authentification

*Source de vérité : `packages/types/src/index.ts`*

Les types partagés (`LoginPayload`, `LoginResponse`, `RefreshPayload`,
`RefreshResponse`, `LogoutPayload`, `LogoutResponse`, `AuthUser`) sont définis
dans `packages/types/src/index.ts` et importés par le backend
(`@nicecord/types`) et le frontend (`@nicecord/types`).

## Endpoints REST

### POST `/api/v1/auth/login`
Authentifie un utilisateur et retourne le JWT.

**Request body** (`LoginPayload`) :
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Réponse 200** (`LoginResponse`) :
```json
{
  "token": "<jwt-access-token>",
  "refreshToken": "<jwt-refresh-token>",
  "user": { "id": "...", "username": "...", "avatar": null }
}
```

**Réponse 400** : `{ "error": "Invalid input" }` — validation Zod (email invalide, mot de passe manquant)

**Réponse 401** : `{ "error": "Invalid credentials" }` — credentials incorrects

---

### POST `/api/v1/auth/refresh`
Échange un refresh-token contre un nouveau access-token.

**Request body** (`RefreshPayload`) :
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```

**Réponse 200** (`RefreshResponse`) :
```json
{
  "token": "<jwt-access-token>",
  "refreshToken": "<jwt-refresh-token>"
}
```

**Réponse 400** : `{ "error": "Invalid input" }`

**Réponse 401** : `{ "error": "Invalid refresh token" }` — refresh-token expiré ou invalide

---

### POST `/api/v1/auth/logout`
Invalide le refresh-token côté serveur (ou client uniquement).

**Request body** (`LogoutPayload`) :
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
*`refreshToken` est optionnel — le client peut simplement effacer le stockage local.*

**Réponse 200** (`LogoutResponse`) :
```json
{
  "ok": true
}
```

## Socket.IO
Le token JWT est passé via `socket.handshake.auth.token` :

```ts
const socket = io(URL, {
  auth: { token: localStorage.getItem('accessToken') },
  transports: ['websocket'],
});
```

Le serveur valide le token via le middleware `auth.middleware.ts` avant tout
événement. Si le token est absent ou invalide, le serveur émet une erreur
`AUTH_ERROR`.

## Durées de validité des tokens
| Token            | Durée   | Usage                         |
|------------------|---------|-------------------------------|
| Access token     | 15 min  | Authentifie les requêtes API  |
| Refresh token    | 7 jours | Permet d'obtenir un nouvel access token |
