import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { ExtendedRequest, TokenPayload } from '../types';

export const authMiddleware = (req: ExtendedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  req.user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      req.user = null;
    }
  }

  next();
};
