import type { Content } from '@/types';
import type { RecommendationStrategy } from './strategies/RecommendationStrategy';
import type { MatchResult, RankedContent } from './strategies/types';
import { HybridStrategy } from './strategies/HybridStrategy';

export class RecommendationService {
  private strategy: RecommendationStrategy;

  constructor(strategy?: RecommendationStrategy) {
    this.strategy = strategy || new HybridStrategy();
  }

  /**
   * Sets a custom strategy dynamically if needed.
   */
  public setStrategy(strategy: RecommendationStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Computes recommendation match score and explanation for target or candidate.
   */
  public computeRecommendationScore(target: Content, candidate?: Content): MatchResult {
    const result = this.strategy.evaluate(target, candidate);
    return {
      ...result,
      candidateId: candidate?.id,
    };
  }

  /**
   * Ranks similar content candidates deterministically using the current strategy.
   */
  public rankSimilarContent(target: Content, candidates: Content[]): RankedContent[] {
    const filtered = candidates.filter((c) => c.id !== target.id);

    const ranked: RankedContent[] = filtered.map((candidate) => {
      const matchResult = this.computeRecommendationScore(target, candidate);
      return {
        content: candidate,
        matchResult,
      };
    });

    // Sort descending by score
    return ranked.sort((a, b) => b.matchResult.score - a.matchResult.score);
  }

  /**
   * Generates deterministic human-readable explanations.
   */
  public generateExplanations(target: Content, candidate?: Content): string[] {
    const result = this.computeRecommendationScore(target, candidate);
    return result.explanations;
  }
}

export const recommendationService = new RecommendationService();
