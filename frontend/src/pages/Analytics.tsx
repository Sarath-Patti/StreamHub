import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  OverviewCards,
  GenreDistributionChart,
  ContentTypeDistributionChart,
  CollectionInsightsCard,
  RecommendationInsightsCard,
  ActivityTimeline,
} from '@/components/analytics';

export const Analytics: React.FC = () => {
  const { summary } = useAnalytics();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Analytics & <span className="gradient-text">Insights</span> Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time telemetry, collection stats, and recommendation performance indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-800 border border-surface-700/60 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">Live Service Telemetry</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <OverviewCards summary={summary} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenreDistributionChart genres={summary.genreDistribution} />
        <ContentTypeDistributionChart types={summary.contentTypeDistribution} />
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionInsightsCard stats={summary.collectionStats} />
        <RecommendationInsightsCard stats={summary.recommendationStats} />
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline events={summary.recentEvents} />
    </div>
  );
};

export default Analytics;
