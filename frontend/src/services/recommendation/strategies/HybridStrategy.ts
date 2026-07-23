import type { Content } from '@/types';
import type { RecommendationStrategy } from './RecommendationStrategy';
import type { StrategyResult, ScoreFactor } from './types';
import { GenreSimilarityStrategy } from './GenreSimilarityStrategy';
import { RatingStrategy } from './RatingStrategy';
import { TrendingStrategy } from './TrendingStrategy';
import { RecencyStrategy } from './RecencyStrategy';
import { DiversityStrategy } from './DiversityStrategy';

export class HybridStrategy implements RecommendationStrategy {
  readonly name = 'Hybrid Recommendation Strategy';
  readonly maxScore = 100;

  private strategies: RecommendationStrategy[];

  constructor(strategies?: RecommendationStrategy[]) {
    this.strategies = strategies || [
      new GenreSimilarityStrategy(),
      new RatingStrategy(),
      new TrendingStrategy(),
      new RecencyStrategy(),
      new DiversityStrategy(),
    ];
  }

  evaluate(target: Content, candidate?: Content): StrategyResult {
    let totalScore = 0;
    let totalMax = 0;
    const allFactors: ScoreFactor[] = [];
    const allExplanations: string[] = [];

    for (const strategy of this.strategies) {
      const res = strategy.evaluate(target, candidate);
      totalScore += res.score;
      totalMax += res.maxScore;
      allFactors.push(...res.factors);
      allExplanations.push(...res.explanations);
    }

    // Scale to maxScore (100) if totalMax happens to differ
    const normalizedScore = totalMax > 0 ? Math.round((totalScore / totalMax) * this.maxScore) : 0;

    return {
      score: normalizedScore,
      maxScore: this.maxScore,
      factors: allFactors,
      explanations: allExplanations,
    };
  }
}
