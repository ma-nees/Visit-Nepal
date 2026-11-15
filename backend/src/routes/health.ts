import { Router } from 'express';
import { checkDbHealth } from '../config/db';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await checkDbHealth();
  res.json({
    service: 'visitnepal-backend',
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.connected ? 'connected' : 'disconnected (using fallback store)',
    ...(db.error ? { dbNote: db.error } : {}),
  });
});

export default router;

