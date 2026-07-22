import { Response, NextFunction } from 'express';
import { logger as baseLogger } from '../logger';
import { AppError } from '../errors';
import { ExtendedRequest } from '../types';

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
