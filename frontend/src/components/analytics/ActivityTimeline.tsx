import React from 'react';
import type { AnalyticsEvent } from '@/services/analytics';

interface ActivityTimelineProps {
  events: AnalyticsEvent[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const getEventBadge = (type: AnalyticsEvent['type']) => {
    switch (type) {
      case 'COLLECTION_CREATED':
        return { icon: '📁', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'CONTENT_ADDED':
        return { icon: '➕', bg: 'bg-brand-500/20 text-brand-300 border-brand-500/30' };
      case 'CONTENT_REMOVED':
        return { icon: '➖', bg: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'STRATEGY_CHANGED':
        return { icon: '⚡', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      default:
        return { icon: '📌', bg: 'bg-surface-700 text-text-secondary border-surface-600' };
    }
  };

  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📜</span> Recent Activity & Audit Log
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Timeline of workspace operations and algorithm interactions
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-700">
        {events.map((evt) => {
          const badge = getEventBadge(evt.type);
          return (
            <div key={evt.id} className="relative flex items-start gap-4 group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${badge.bg}`}
              >
                {badge.icon}
              </div>

              {/* Event Content */}
              <div className="flex-1 rounded-xl bg-surface-900/60 border border-surface-700/50 p-3 transition-all hover:border-surface-600">
                <p className="text-xs font-bold text-white">{evt.details}</p>
                <p className="text-[10px] text-text-muted mt-1">
                  {new Date(evt.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
