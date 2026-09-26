/**
 * Router pour la gestion des serveurs (guilds).
 * (stub minimal)
 */
import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => res.json([]));
router.post('/', (_req, res) => res.status(201).json({}));

export { router as guildRouter };
