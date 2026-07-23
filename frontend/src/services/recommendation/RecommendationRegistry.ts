import type { RecommendationStrategy } from './strategies/RecommendationStrategy';
import { HybridStrategy } from './strategies/HybridStrategy';
import { GenreStrategy } from './strategies/GenreStrategy';
import { TrendingStrategy } from './strategies/TrendingStrategy';
import { HiddenGemsStrategy } from './strategies/HiddenGemsStrategy';
import { CriticsChoiceStrategy } from './strategies/CriticsChoiceStrategy';

export class RecommendationRegistry {
  private strategies: Map<string, RecommendationStrategy> = new Map();
  private defaultStrategyId: string = 'hybrid';

  constructor() {
    // Register standard default strategies
    this.register(new HybridStrategy());
    this.register(new GenreStrategy());
    this.register(new TrendingStrategy());
    this.register(new HiddenGemsStrategy());
    this.register(new CriticsChoiceStrategy());
  }

  /**
   * Registers a new strategy dynamically without modifying existing strategies.
   */
  public register(strategy: RecommendationStrategy): void {
    this.strategies.set(strategy.id.toLowerCase(), strategy);
  }

  /**
   * Looks up a registered strategy by ID.
   * Returns default strategy if lookup fails (no switch statements used).
   */
  public get(id: string): RecommendationStrategy {
    const key = id.toLowerCase();
    const strategy = this.strategies.get(key);
    if (!strategy) {
      console.warn(`[RecommendationRegistry] Strategy '${id}' not found. Falling back to default.`);
      return this.getDefault();
    }
    return strategy;
  }

  /**
   * Returns all registered strategies for UI selector discovery.
   */
  public getAll(): RecommendationStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Returns the default strategy (HybridStrategy).
   */
  public getDefault(): RecommendationStrategy {
    return this.strategies.get(this.defaultStrategyId) || new HybridStrategy();
  }

  /**
   * Checks if a strategy ID is registered.
   */
  public has(id: string): boolean {
    return this.strategies.has(id.toLowerCase());
  }
}

export const recommendationRegistry = new RecommendationRegistry();
