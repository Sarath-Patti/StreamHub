import { collectionService } from '@/services/collection';
import { recommendationRegistry } from '@/services/recommendation';
import { AnalyticsAggregator } from './AnalyticsAggregator';
import type {
  AnalyticsEvent,
  DashboardSummary,
  CollectionStats,
  GenreCount,
  ContentTypeCount,
  RecommendationStats,
} from './types';

const EVENT_STORAGE_KEY = 'streamhub_analytics_events';
type Listener = () => void;

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private listeners: Set<Listener> = new Set();
  private cache: DashboardSummary | null = null;

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const data = localStorage.getItem(EVENT_STORAGE_KEY);
      if (data) {
        this.events = JSON.parse(data);
      } else {
        // Initial sample timeline events
        this.events = [
          {
            id: 'evt-1',
            type: 'COLLECTION_CREATED',
            details: 'Created workspace collection "Favorites"',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: 'evt-2',
            type: 'CONTENT_ADDED',
            details: 'Added title "Inception" to Favorites',
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: 'evt-3',
            type: 'STRATEGY_CHANGED',
            details: 'Switched default recommendation algorithm to "Critics\' Choice"',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ];
        this.saveEvents();
      }
    } catch {
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(this.events.slice(0, 50)));
    } catch (e) {
      console.error('[AnalyticsService] Failed to save events:', e);
    }
    this.invalidateCache();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private invalidateCache(): void {
    this.cache = null;
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Tracks an analytics event in the activity timeline.
   */
  public trackEvent(type: AnalyticsEvent['type'], details: string): void {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      details,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(newEvent);
    this.saveEvents();
  }

  /**
   * Returns recent logged user activity events.
   */
  public getRecentEvents(limit: number = 10): AnalyticsEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Computes or returns memoized dashboard summary.
   */
  public getDashboardSummary(): DashboardSummary {
    if (this.cache) return this.cache;

    const collections = collectionService.getCollections();
    const collectionStats: CollectionStats = AnalyticsAggregator.calculateCollectionStats(collections);
    const genreDistribution: GenreCount[] = AnalyticsAggregator.calculateGenreDistribution(collections);
    const contentTypeDistribution: ContentTypeCount[] = AnalyticsAggregator.calculateContentTypeDistribution(collections);

    const defaultStrategy = recommendationRegistry.getDefault();
    const recommendationStats: RecommendationStats = AnalyticsAggregator.calculateRecommendationStats(
      defaultStrategy.id,
      defaultStrategy.name
    );

    const favoriteGenre = genreDistribution[0]?.name || 'Sci-Fi';

    this.cache = {
      collectionStats,
      genreDistribution,
      contentTypeDistribution,
      recommendationStats,
      recentEvents: this.getRecentEvents(10),
      favoriteGenre,
    };

    return this.cache;
  }

  public getCollectionStatistics(): CollectionStats {
    return this.getDashboardSummary().collectionStats;
  }

  public getGenreDistribution(): GenreCount[] {
    return this.getDashboardSummary().genreDistribution;
  }

  public getContentTypeDistribution(): ContentTypeCount[] {
    return this.getDashboardSummary().contentTypeDistribution;
  }

  public getRecommendationStatistics(): RecommendationStats {
    return this.getDashboardSummary().recommendationStats;
  }

  public getTopGenres(limit: number = 3): string[] {
    return this.getGenreDistribution()
      .slice(0, limit)
      .map((g) => g.name);
  }

  public getRecentlyAddedCollections(): string[] {
    const summary = this.getDashboardSummary();
    const name = summary.collectionStats.newestCollectionName;
    return name ? [name] : [];
  }
}

export const analyticsService = new AnalyticsService();
