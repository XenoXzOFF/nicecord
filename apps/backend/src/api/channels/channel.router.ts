/**
 * Router pour la gestion des salons (channels).
 * (stub minimal)
 */
import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => res.json([]));
router.get('/:id', (_req, res) => res.json({}));

export { router as channelRouter };
