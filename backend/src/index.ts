import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { config } from '@/config/env';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { logger } from '@/logger';
import { globalErrorHandler } from '@/middleware/errorHandler';
import healthRouter from '@/routes/health';

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.use(globalErrorHandler);

  app.listen(config.port, () => {
    logger.info(`Backend server running on port ${config.port}`);
    logger.info(`GraphQL endpoint ready at http://localhost:${config.port}/graphql`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start backend server', err);
  process.exit(1);
});
