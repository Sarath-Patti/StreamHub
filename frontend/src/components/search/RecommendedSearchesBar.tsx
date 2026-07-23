import React from 'react';
import type { RecommendedSearchPreset } from '@/services/search';

interface RecommendedSearchesBarProps {
  presets: RecommendedSearchPreset[];
  onSelectPreset: (preset: RecommendedSearchPreset) => void;
}

export const RecommendedSearchesBar: React.FC<RecommendedSearchesBarProps> = ({
  presets,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <span>✨</span> Recommended Discovery Searches
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-800/80 border border-surface-700/60 hover:border-brand-500/50 cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 shadow-md group"
          >
            <span className="text-2xl p-2 rounded-xl bg-surface-900 group-hover:scale-110 transition-transform">
              {preset.icon}
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                {preset.title}
              </h4>
              <p className="text-[10px] text-text-muted truncate mt-0.5">{preset.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
