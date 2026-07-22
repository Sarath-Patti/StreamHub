import { Request, Response } from 'express';
import { Logger, logger as defaultLogger } from '@/shared/logger';

export interface GraphQLContext {
  req: Request;
  res: Response;
  requestId?: string;
  logger: Logger;
  user?: null;
}

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> => {
  const extendedReq = req as Request & { id?: string; logger?: Logger };
  return {
    req,
    res,
    requestId: extendedReq.id,
    logger: extendedReq.logger || defaultLogger,
    user: null,
  };
};
