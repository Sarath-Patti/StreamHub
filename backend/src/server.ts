import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { config } from '@/config/env';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { createContext } from '@/graphql/context';
import { logger } from '@/shared/logger';
import {
  requestIdMiddleware,
  requestLoggerMiddleware,
  authMiddleware,
  globalErrorHandlerMiddleware,
} from '@/shared/middleware';
import { formatGraphQLError } from '@/shared/errors';
import healthRouter from '@/routes/health';

export async function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(authMiddleware);

  app.use('/api', healthRouter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: formatGraphQLError,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: createContext,
    })
  );

  app.use(globalErrorHandlerMiddleware);

  return { app, server };
}

export async function startServer() {
  const { app } = await createServer();

  app.listen(config.port, () => {
    logger.info(`Backend server running on port ${config.port} (${config.nodeEnv})`);
    logger.info(`GraphQL endpoint ready at http://localhost:${config.port}/graphql`);
  });
}
