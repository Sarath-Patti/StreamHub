import { Request, Response, NextFunction } from 'express';

export const securityHeadersMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 500;

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = (req.ip || req.socket.remoteAddress || 'unknown').toString();
  const now = Date.now();

  let record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    rateLimitMap.set(ip, record);
  }

  record.count += 1;

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

  if (record.count > MAX_REQUESTS) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
    return;
  }

  next();
};
