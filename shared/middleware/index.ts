import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger as baseLogger } from '../logger';
import { AppError } from '../errors';

export interface ExtendedRequest extends Request {
  id?: string;
  logger?: typeof baseLogger;
  user?: null;
}

export const requestIdMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  req.logger = baseLogger.child({ requestId });
  next();
};

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

export const authPlaceholderMiddleware = (req: ExtendedRequest, _res: Response, next: NextFunction): void => {
  // Prepared for future authentication without implementing auth logic
  req.user = null;
  next();
};

export const globalErrorHandlerMiddleware = (
  err: Error,
  req: ExtendedRequest,
  res: Response,
  _next: NextFunction
): void => {
  const reqLogger = req.logger || baseLogger;
  const isProduction = process.env.NODE_ENV === 'production';

  if (err instanceof AppError) {
    if (!err.isOperational) {
      reqLogger.error({ err, requestId: req.id }, 'Non-operational application error');
    } else {
      reqLogger.warn({ err, requestId: req.id }, 'Operational application error');
    }

    res.status(err.statusCode).json({
      error: {
        name: err.name,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
      requestId: req.id,
    });
    return;
  }

  reqLogger.error({ err, requestId: req.id }, 'Unhandled server error');

  res.status(500).json({
    error: {
      name: 'InternalServerError',
      message: isProduction ? 'Internal Server Error' : err.message,
    },
    requestId: req.id,
  });
};
