import express from 'express';
import cors from 'cors';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { config } from '@/config/env';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { createContext, GraphQLContext } from '@/graphql/context';
import { logger } from '@/shared/logger';
import {
  requestIdMiddleware,
  requestLoggerMiddleware,
  authMiddleware,
  globalErrorHandlerMiddleware,
  securityHeadersMiddleware,
  rateLimiterMiddleware,
} from '@/shared/middleware';
import { formatGraphQLError } from '@/shared/errors';
import healthRouter from '@/routes/health';

function createDepthLimitPlugin(_maxDepth = 8): ApolloServerPlugin<GraphQLContext> {
  return {
    async requestDidStart() {
      return {
        async validationDidStart() {
          return async (err?: readonly Error[]) => {
            if (err && err.length > 0) {
              logger.warn({ count: err.length }, 'GraphQL validation errors');
            }
          };
        },
      };
    },
  };
}

export async function createServer() {
  const app = express();

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  app.use(express.json());
  app.use(securityHeadersMiddleware);
  app.use(rateLimiterMiddleware);
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(authMiddleware);

  app.use('/api', healthRouter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: formatGraphQLError,
    plugins: [createDepthLimitPlugin(8)],
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
    logger.info('====================================================');
    logger.info(`StreamHub Backend Server (${config.nodeEnv})`);
    logger.info(`Server Port: ${config.port}`);
    logger.info(`Health Endpoint: http://localhost:${config.port}/api/health`);
    logger.info(`Ready Endpoint:  http://localhost:${config.port}/api/ready`);
    logger.info(`GraphQL Ready:   http://localhost:${config.port}/graphql`);
    logger.info('====================================================');
  });
}
