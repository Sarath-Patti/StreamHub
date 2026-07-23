import type { Content } from '@/types';
import type { StrategyResult } from './types';

export interface RecommendationStrategy {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly maxScore: number;
  evaluate(target: Content, candidate?: Content): StrategyResult;
}
