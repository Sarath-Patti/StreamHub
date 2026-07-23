import React from 'react';
import type { RecommendationStats } from '@/services/analytics';

interface RecommendationInsightsCardProps {
  stats: RecommendationStats;
}

export const RecommendationInsightsCard: React.FC<RecommendationInsightsCardProps> = ({
  stats,
}) => {
  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Recommendation Engine Insights
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Strategy distribution and recommendation score confidence
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Default Strategy & Confidence */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-900/60 border border-surface-700/50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Default Strategy
            </span>
            <p className="text-sm font-bold text-brand-300 mt-0.5">{stats.defaultStrategyName}</p>
          </div>

          <div className="rounded-xl bg-surface-900/60 border border-surface-700/50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Confidence Index
            </span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">
              {stats.confidenceIndex} / 100
            </p>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-text-muted">Score Distribution</span>
          <div className="space-y-2">
            {stats.scoreDistribution.map((dist) => (
              <div key={dist.range} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary">{dist.range}</span>
                  <span className="font-bold text-white">{dist.percentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recommended Genres */}
        <div className="pt-2 border-t border-surface-700/60">
          <span className="text-xs font-bold text-text-muted">Top Recommended Genres</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {stats.topRecommendedGenres.map((g) => (
              <span
                key={g}
                className="rounded-lg bg-surface-700/70 border border-surface-600/60 px-2.5 py-1 text-xs font-semibold text-text-secondary"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
