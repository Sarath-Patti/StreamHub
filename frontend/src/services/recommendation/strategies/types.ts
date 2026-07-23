import type { Content } from '@/types';

export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface StrategyResult {
  score: number;
  maxScore: number;
  factors: ScoreFactor[];
  explanations: string[];
}

export interface MatchResult extends StrategyResult {
  candidateId?: string;
}

export interface RankedContent {
  content: Content;
  matchResult: MatchResult;
}
