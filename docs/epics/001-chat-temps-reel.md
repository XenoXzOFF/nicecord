# Épic : Chat texte temps réel

## Objectif
Permettre à des utilisateurs connectés d'échanger des messages textuels en
temps réel dans des salons, comme Discord.

## Stories

| # | User Story | Priorité | Assigné à |
|---|------------|----------|-----------|
| US-01 | En tant qu'utilisateur, je peux rejoindre un salon texte et voir les messages historiques | Haute | frontend-developer |
| US-02 | En tant qu'utilisateur, je peux envoyer un message et le voir apparaître instantanément | Haute | backend-realtime |
| US-03 | En tant qu'utilisateur, je vois les autres utilisateurs qui tapent (typing indicator) | Moyenne | backend-realtime |
| US-04 | En tant qu'utilisateur, je reçois les nouveaux messages sans rafraîchir | Haute | backend-realtime |
| US-05 | En tant qu'utilisateur, le message affiché reste cohérent si je me déconnecte et me reconnecte | Moyenne | backend-realtime |

## Événements Socket.IO
- `message:create` → serveur
- `message:created` → broadcast salon
- `typing:start` / `typing:stop` → broadcast
- `typing:update` ← broadcast
- `message:error` ← pour les erreurs de validation

## Critères d'acceptation
- [ ] Un message envoyé apparaît sur tous les clients connectés au salon en < 100ms
- [ ] Le typing indicator s'affiche/dissocie correctement
- [ ] Les messages sont persistés et rechargés à la connexion
- [ ] L'UI est conforme au design Discord (voir [[skill-ui-discord]])
