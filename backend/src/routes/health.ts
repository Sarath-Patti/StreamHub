import { Router, Request, Response } from 'express';
import { config } from '@/config/env';
import { APP_NAME, APP_VERSION } from '@/shared/constants';
import { prisma } from '@/config/prisma';

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

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'UP',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
