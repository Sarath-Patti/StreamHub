import { LogLevel } from './LogLevel';
import type { LogEntry } from './types';
import { isDev } from '@/config/environment';

export class Logger {
  private moduleName: string;
  private minLevel: LogLevel;

  constructor(moduleName: string, minLevel?: LogLevel) {
    this.moduleName = moduleName;
    this.minLevel = minLevel ?? (isDev ? LogLevel.DEBUG : LogLevel.WARN);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      moduleName: this.moduleName,
      message,
      data,
    };

    const prefix = `[${entry.timestamp}] [${LogLevel[level]}] [${entry.moduleName}]:`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data !== undefined ? data : '');
        break;
    }
  }

  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  public error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }
}

export const createLogger = (moduleName: string) => new Logger(moduleName);
