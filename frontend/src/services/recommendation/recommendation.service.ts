import type { Content } from '@/types';
import type { MatchResult, RankedContent } from './strategies/types';
import { RecommendationRegistry, recommendationRegistry } from './RecommendationRegistry';

export class RecommendationService {
  private registry: RecommendationRegistry;
  private cache: Map<string, MatchResult> = new Map();

  constructor(registry?: RecommendationRegistry) {
    this.registry = registry || recommendationRegistry;
  }

  /**
   * Generates a cache key for memoizing calculations.
   */
  private getCacheKey(strategyId: string, targetId: string, candidateId?: string): string {
    return `${strategyId}:${targetId}:${candidateId || 'self'}`;
  }

  /**
   * Computes recommendation score and explanation using the specified strategy ID.
   * Leverages internal memoization to avoid redundant computations.
   */
  public computeRecommendationScore(
    target: Content,
    candidate?: Content,
    strategyId: string = 'hybrid'
  ): MatchResult {
    const key = this.getCacheKey(strategyId, target.id, candidate?.id);
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const strategy = this.registry.get(strategyId);
    const result = strategy.evaluate(target, candidate);
    const matchResult: MatchResult = {
      ...result,
      candidateId: candidate?.id,
    };

    this.cache.set(key, matchResult);
    return matchResult;
  }

  /**
   * Ranks similar content candidates using the chosen strategy without page reload.
   */
  public rankSimilarContent(
    target: Content,
    candidates: Content[],
    strategyId: string = 'hybrid'
  ): RankedContent[] {
    const filtered = candidates.filter((c) => c.id !== target.id);

    const ranked: RankedContent[] = filtered.map((candidate) => {
      const matchResult = this.computeRecommendationScore(target, candidate, strategyId);
      return {
        content: candidate,
        matchResult,
      };
    });

    return ranked.sort((a, b) => b.matchResult.score - a.matchResult.score);
  }

  /**
   * Compares scores for a target/candidate across all registered strategies side-by-side.
   */
  public compareAlgorithms(
    target: Content,
    candidate?: Content
  ): Array<{
    strategyId: string;
    strategyName: string;
    description: string;
    score: number;
    maxScore: number;
    explanations: string[];
  }> {
    const strategies = this.registry.getAll();

    return strategies.map((strategy) => {
      const match = this.computeRecommendationScore(target, candidate, strategy.id);
      return {
        strategyId: strategy.id,
        strategyName: strategy.name,
        description: strategy.description,
        score: match.score,
        maxScore: match.maxScore,
        explanations: match.explanations,
      };
    });
  }

  /**
   * Clears the calculation cache.
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

export const recommendationService = new RecommendationService();
