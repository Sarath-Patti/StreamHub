import { Request, Response } from 'express';
import { Logger, logger as defaultLogger } from '@/shared/logger';
import { AuthUser, ExtendedRequest } from '@/shared/types';

export interface GraphQLContext {
  req: Request;
  res: Response;
  requestId?: string;
  logger: Logger;
  user: AuthUser | null;
}

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> => {
  const extendedReq = req as ExtendedRequest;
  return {
    req,
    res,
    requestId: extendedReq.id,
    logger: extendedReq.logger || defaultLogger,
    user: extendedReq.user || null,
  };
};
