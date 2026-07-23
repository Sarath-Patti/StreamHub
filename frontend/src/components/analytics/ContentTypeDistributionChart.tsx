import React from 'react';
import type { ContentTypeCount } from '@/services/analytics';

interface ContentTypeDistributionChartProps {
  types: ContentTypeCount[];
}

export const ContentTypeDistributionChart: React.FC<ContentTypeDistributionChartProps> = ({
  types,
}) => {
  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎥</span> Content Format Breakdown
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Distribution across movies, series, documentaries, and animation
          </p>
        </div>
      </div>

      {/* Progress Stacked Bar */}
      <div className="h-4 w-full overflow-hidden rounded-xl bg-surface-900 flex p-0.5 border border-surface-700/60 shadow-inner">
        {types.map((t, idx) => {
          const bgColors = [
            'bg-brand-500',
            'bg-indigo-500',
            'bg-emerald-500',
            'bg-amber-500',
          ];
          return (
            <div
              key={t.type}
              title={`${t.type}: ${t.percentage}%`}
              className={`h-full ${bgColors[idx % bgColors.length]} transition-all duration-500 first:rounded-l-lg last:rounded-r-lg`}
              style={{ width: `${Math.max(t.percentage, 4)}%` }}
            />
          );
        })}
      </div>

      {/* Format Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {types.map((t, idx) => {
          const borderColors = [
            'border-brand-500/40 bg-brand-500/10',
            'border-indigo-500/40 bg-indigo-500/10',
            'border-emerald-500/40 bg-emerald-500/10',
            'border-amber-500/40 bg-amber-500/10',
          ];
          return (
            <div
              key={t.type}
              className={`rounded-xl border p-3 flex flex-col justify-between ${borderColors[idx % borderColors.length]}`}
            >
              <span className="text-xs font-semibold text-text-muted">{t.type}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl font-black text-white">{t.count}</span>
                <span className="text-xs font-extrabold text-brand-300">{t.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
