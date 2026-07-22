import { Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger as baseLogger } from '../logger';
import { ExtendedRequest } from '../types';

export const requestIdMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  req.logger = baseLogger.child({ requestId });
  next();
};
