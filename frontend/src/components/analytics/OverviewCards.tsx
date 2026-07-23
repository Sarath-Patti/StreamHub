import React from 'react';
import type { DashboardSummary } from '@/services/analytics';

interface OverviewCardsProps {
  summary: DashboardSummary;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ summary }) => {
  const { collectionStats, favoriteGenre, recommendationStats } = summary;

  const kpis = [
    {
      title: 'Total Collections',
      value: collectionStats.totalCollections,
      subtext: `${collectionStats.growthSummary}`,
      icon: '📚',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Saved Titles',
      value: collectionStats.totalSavedTitles,
      subtext: `Across all workspaces`,
      icon: '🎬',
      color: 'from-brand-500/20 to-purple-500/20 border-brand-500/30 text-brand-400',
    },
    {
      title: 'Favorite Genre',
      value: favoriteGenre,
      subtext: `Most cataloged genre tag`,
      icon: '⭐',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Rec. Accuracy',
      value: `${recommendationStats.accuracyEstimate}%`,
      subtext: `Confidence index ${recommendationStats.confidenceIndex}/100`,
      icon: '🎯',
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Avg Collection Size',
      value: `${collectionStats.averageCollectionSize}`,
      subtext: `Titles per collection`,
      icon: '📊',
      color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className={[
            'rounded-2xl p-5 border bg-gradient-to-br backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
            kpi.color,
          ].join(' ')}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{kpi.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              KPI
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {kpi.value}
            </h3>
            <p className="text-xs font-bold text-white/90">{kpi.title}</p>
            <p className="text-[11px] text-text-muted truncate">{kpi.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
