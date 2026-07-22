import { Request, Response, NextFunction } from 'express';
import { logger } from '@/logger';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled error occurred', err);
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
};
