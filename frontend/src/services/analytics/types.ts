export interface AnalyticsEvent {
  id: string;
  type: 'COLLECTION_CREATED' | 'COLLECTION_UPDATED' | 'COLLECTION_DELETED' | 'CONTENT_ADDED' | 'CONTENT_REMOVED' | 'STRATEGY_CHANGED';
  details: string;
  timestamp: string;
}

export interface GenreCount {
  name: string;
  count: number;
  percentage: number;
}

export interface ContentTypeCount {
  type: string;
  count: number;
  percentage: number;
}

export interface CollectionStats {
  totalCollections: number;
  totalSavedTitles: number;
  averageCollectionSize: number;
  largestCollectionName?: string;
  largestCollectionSize: number;
  newestCollectionName?: string;
  recentlyUpdatedName?: string;
  growthSummary: string;
}

export interface RecommendationStats {
  defaultStrategyId: string;
  defaultStrategyName: string;
  accuracyEstimate: number;
  confidenceIndex: number;
  scoreDistribution: Array<{ range: string; count: number; percentage: number }>;
  topRecommendedGenres: string[];
}

export interface DashboardSummary {
  collectionStats: CollectionStats;
  genreDistribution: GenreCount[];
  contentTypeDistribution: ContentTypeCount[];
  recommendationStats: RecommendationStats;
  recentEvents: AnalyticsEvent[];
  favoriteGenre: string;
}
