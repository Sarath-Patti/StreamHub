import { startServer } from './server';
import { logger } from '@/shared/logger';

startServer().catch((err) => {
  logger.error('Failed to start backend server', err);
  process.exit(1);
});
