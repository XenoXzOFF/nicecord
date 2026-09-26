---
name: /deploy-preview
description: "Déployer un preview de Nicecord (frontend + backend) et générer un lien"
---

# Commande : /deploy-preview

## Description
Déploie une preview du frontend et du backend de Nicecord sur la branche courante,
génère un lien de preview et notifie le salon Discord d'équipe.

## Paramètres
- `{{branch}}` — branche courante (obligatoire)

## Étapes
1. Build frontend (`npm run build --filter=frontend`)
2. Build backend (`npm run build --filter=backend`)
3. Déployer vers le provider (Vercel pour le frontend, Railway pour le backend)
4. Mettre à jour les variables d'environnement (Socket.IO URL)
5. Poster le lien de preview dans Discord

## Prompts associés
Utilise l'agent `architect-supervisor` pour valider la config avant déploiement.
