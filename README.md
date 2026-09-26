![Nicecord — Discord clone](https://img.shields.io/badge/Nicecord-v0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

# Nicecord

Un clone web de Discord construit avec une **architecture multi-agents IA** et une stack TypeScript moderne.

> **⚠️ Ce projet est en développement.** Lisez [`docs/architecture.md`](./docs/architecture.md) pour les décisions d'architecture.

## ✨ Fonctionnalités (roadmap)

| Fonctionnalité | Statut | Responsable |
|----------------|--------|-------------|
| Authentification (JWT / OAuth) | 🔴 À faire | `backend-realtime` |
| Création serveurs / salons | 🔴 À faire | `backend-realtime` + `frontend-developer` |
| Chat texte en temps réel | 🔴 À faire | `backend-realtime` + `frontend-developer` |
| Canaux vocaux (WebRTC) | 🚧 À planifier | `backend-realtime` |
| Friends / Presence | 🚧 À planifier | — |
| Modération & rôles | 🚧 À planifier | — |

## 🏗️ Architecture

```
nicecord/
├── .claude/
│   ├── agents/                  # 3 agents IA (architecte, front, back)
│   ├── skills/                  # 3 skills (UI, WebSocket, Tailwind)
│   └── settings.json            # Configuration environnement + index
├── apps/
│   ├── frontend/               # Next.js 15 + React 19 + Tailwind
│   └── backend/                # Node.js 22 + Express + Socket.IO
├── packages/
│   └── types/                  # Types partagés (@nicecord/types)
├── docs/
│   ├── architecture.md
│   ├── api-contracts/          # Contrats d'API
│   └── epics/                  # Fiches fonctionnelles
├── docker-compose.yml
├── package.json                # Monorepo npm workspaces + Turborepo
└── tsconfig.json               # Projet TypeScript composite
```

Consulte le [guide complet de l'architecture](./docs/architecture.md).

## 🚀 Démarrage

```bash
# Cloner et installer
git clone https://github.com/pcnat/nicecord.git
cd nicecord
npm install

# Créer les fichiers .env locaux à partir du modèle
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env 2>/dev/null || cp .env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local 2>/dev/null || cp .env.example apps/frontend/.env.local

# Lancer PostgreSQL + Redis (Docker)
docker-compose up -d db redis

# Démarrer le frontend + le backend
npm run dev
```

| Service      | URL                          |
|--------------|------------------------------|
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:4000        |
| Socket.IO    | http://localhost:4000/socket.io |

## 🤖 Agents IA

Le projet est orchestré par trois agents IA définis dans [`.claude/agents/`](./.claude/agents/) :

- **Architecte/Superviseur** — planifie, coordonne, valide l'architecture
- **Développeur Front-end** — UI Discord sombre (React + Tailwind)
- **Développeur Back-end & Temps Réel** — API REST + Socket.IO

Invoque un agent via l'**Agent tool** avec le `subagent_type` correspondant.

## 📐 Skills

Trois skills personnalisées disponibles dans [`.claude/skills/`](./.claude/skills/) :

| Skill | Description |
|-------|-------------|
| `skill-ui-discord` | Charte graphique exacte Discord (#313338, typo, layout 3 colonnes) |
| `skill-websocket` | Templates Socket.IO client/serveur + gestion rooms |
| `skill-tailwind-components` | Guide composants interactifs (boutons, modales, listes) |

Utilise-les avec l'outil Skill : `Skill(skill-ui-discord)`

## 🔧 Scripts utiles

```bash
npm run dev           # frontend + backend en concurrence
npm run build         # Turborepo build
npm run lint          # ESLint global
npm run typecheck     # vérification TypeScript
npm run test          # tests unitaires (frontend + backend)
npm run db:migrate    # migrations Prisma
```

## 📄 License

MIT © 2026 — développé avec ❤️ par la communauté et l'IA.
