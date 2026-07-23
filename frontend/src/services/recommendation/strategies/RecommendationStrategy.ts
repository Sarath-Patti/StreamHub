import type { Content } from '@/types';
import type { StrategyResult } from './types';

export interface RecommendationStrategy {
  readonly name: string;
  readonly maxScore: number;
  evaluate(target: Content, candidate?: Content): StrategyResult;
}
