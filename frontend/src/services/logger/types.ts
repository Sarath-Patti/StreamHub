import type { LogLevel } from './LogLevel';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  moduleName: string;
  message: string;
  data?: unknown;
}
