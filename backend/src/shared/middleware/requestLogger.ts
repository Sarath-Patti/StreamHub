import { Response, NextFunction } from 'express';
import { logger as baseLogger } from '../logger';
import { ExtendedRequest } from '../types';

export const requestLoggerMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const reqLogger = req.logger || baseLogger;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    reqLogger.info(
      {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs: duration,
        requestId: req.id,
      },
      'HTTP Request completed'
    );
  });

  next();
};
