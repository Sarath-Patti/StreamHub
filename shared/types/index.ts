import { Request } from 'express';
import { Logger } from '../logger';

export interface ExtendedRequest extends Request {
  id?: string;
  logger?: Logger;
  user?: null;
}

export interface HealthResponse {
  appName: string;
  version: string;
  uptime: number;
  environment: string;
  timestamp: string;
}
