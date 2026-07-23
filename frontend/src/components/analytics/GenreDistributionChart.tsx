import React from 'react';
import type { GenreCount } from '@/services/analytics';

interface GenreDistributionChartProps {
  genres: GenreCount[];
}

const GENRE_COLORS = [
  'from-brand-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

export const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ genres }) => {
  const maxCount = Math.max(...genres.map((g) => g.count), 1);

  return (
    <div className="rounded-2xl border border-surface-700/60 bg-surface-800/80 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Genre Distribution
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Breakdown of cataloged genre tags and user interest share
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-300">
          {genres.length} genres tracked
        </span>
      </div>

      <div className="space-y-4">
        {genres.map((genre, idx) => {
          const color = GENRE_COLORS[idx % GENRE_COLORS.length];
          const widthPercent = Math.max(8, Math.round((genre.count / maxCount) * 100));

          return (
            <div key={genre.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  {genre.name}
                  <span className="text-[10px] text-text-muted font-normal">
                    ({genre.count} {genre.count === 1 ? 'title' : 'titles'})
                  </span>
                </span>
                <span className="font-extrabold text-brand-300">{genre.percentage}%</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-surface-900 p-0.5 border border-surface-700/50">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 shadow-sm`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
