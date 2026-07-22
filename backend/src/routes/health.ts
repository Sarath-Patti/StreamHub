import { Router, Request, Response } from 'express';
import { config } from '@/config/env';
import { APP_NAME, APP_VERSION } from '@/shared/constants';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    appName: APP_NAME,
    version: APP_VERSION,
    uptime: process.uptime(),
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

export default router;
