import pino from 'pino';

const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = pino({
  level: logLevel,
  transport: nodeEnv === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export type Logger = typeof logger;
