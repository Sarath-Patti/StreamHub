import { Request } from 'express';
import { Logger } from '../logger';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface ExtendedRequest extends Request {
  id?: string;
  logger?: Logger;
  user?: AuthUser | null;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface HealthResponse {
  appName: string;
  version: string;
  uptime: number;
  environment: string;
  timestamp: string;
}
