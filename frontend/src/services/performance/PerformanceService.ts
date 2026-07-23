import { createLogger } from '@/services/logger';

const logger = createLogger('PerformanceService');

export interface PerformanceMetric {
  name: string;
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private maxStoredMetrics = 100;

  /**
   * Measures execution duration of an async function.
   */
  public async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const durationMs = Math.round(performance.now() - start);
      this.recordMetric(name, durationMs, metadata);
    }
  }

  /**
   * Measures execution duration of a synchronous function.
   */
  public measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, unknown>
  ): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const durationMs = Math.round(performance.now() - start);
      this.recordMetric(name, durationMs, metadata);
    }
  }

  private recordMetric(
    name: string,
    durationMs: number,
    metadata?: Record<string, unknown>
  ): void {
    const metric: PerformanceMetric = {
      name,
      durationMs,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.unshift(metric);
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics.pop();
    }

    logger.debug(`[Perf] ${name} completed in ${durationMs}ms`, metadata);
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getAverageDuration(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, m) => acc + m.durationMs, 0);
    return Math.round(sum / filtered.length);
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceService = new PerformanceService();
