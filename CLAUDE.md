# Nicecord — Agent-Orchestrated Discord Clone

> Ce projet est piloté par un réseau d'agents IA. Consulte les définitions dans `.claude/agents/`.

## Vue d'ensemble
Nicecord est un clone web de Discord construit avec une architecture full-stack TypeScript :
- **Frontend** : Next.js 15 + React 19 + Tailwind CSS (UI sombre fidèle à Discord)
- **Backend** : Node.js 22 + Socket.IO (temps réel) + Express/Fastify + PostgreSQL + Redis
- **Monorepo** : gestion via npm/pnpm workspaces ou Turborepo

## Agents disponibles
| Agent | Rôle | Model recommandé |
|-------|------|----------------:|
| `architect-supervisor` | Coordination, planification, revue d'architecture | Opus / Fable 5.1 |
| `frontend-developer` | Interface utilisateur (React/Next/Tailwind) | Sonnet 5 |
| `backend-realtime` | API REST + WebSockets | Sonnet 5 |

## Skills
| Skill | Usage |
|-------|-------|
| `skill-ui-discord` | Charte graphique exacte de Discord |
| `skill-websocket` | Templates Socket.IO client/serveur |
| `skill-tailwind-components` | Guide composants Tailwind interactifs |

Invoque-les avec : `Skill(skill-ui-discord)`

## Structure du projet
```
nicecord/
├── .claude/
│   ├── agents/           # Définitions d'agents IA
│   ├── skills/           # Compétences personnalisées
│   └── settings.json     # Configuration environnement + index
├── src/
│   ├── frontend/         # Next.js app (App Router)
│   └── backend/          # Node.js server + Socket.IO
├── packages/
│   └── types/            # Types partagés front/back
├── docs/
│   ├── architecture.md
│   └── api-contracts/
├── docker-compose.yml    # Postgres, Redis, backend, frontend
├── package.json
└── tsconfig.json
```

## Démarrage rapide
```bash
npm install
docker-compose up -d        # Postgres + Redis
npm run dev                 # frontend:3000 + backend:4000
```

## Attribution
Toutes les contributions sont co-signées avec l'assistant IA :
```
Co-Authored-By: Claude Code <noreply@anthropic.com>
```
