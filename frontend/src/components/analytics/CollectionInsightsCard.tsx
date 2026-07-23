import React from 'react';
import type { CollectionStats } from '@/services/analytics';

interface CollectionInsightsCardProps {
  stats: CollectionStats;
}

export const CollectionInsightsCard: React.FC<CollectionInsightsCardProps> = ({ stats }) => {
  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📁</span> Collection Workspaces Insights
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Key metrics and size dynamics of user collections
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-700/50">
          <div>
            <p className="text-xs font-semibold text-text-muted">Largest Workspace</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {stats.largestCollectionName || 'None'}
            </p>
          </div>
          <span className="text-xs font-extrabold bg-brand-500/20 text-brand-300 px-2.5 py-1 rounded-full">
            {stats.largestCollectionSize} titles
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-700/50">
          <div>
            <p className="text-xs font-semibold text-text-muted">Newest Collection</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {stats.newestCollectionName || 'None'}
            </p>
          </div>
          <span className="text-xs font-semibold text-text-secondary">Recent</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-700/50">
          <div>
            <p className="text-xs font-semibold text-text-muted">Recently Updated</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {stats.recentlyUpdatedName || 'None'}
            </p>
          </div>
          <span className="text-xs font-semibold text-text-secondary">Active</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-700/50">
          <div>
            <p className="text-xs font-semibold text-text-muted">Average Collection Size</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {stats.averageCollectionSize} titles / workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
