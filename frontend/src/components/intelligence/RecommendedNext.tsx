import React from 'react';
import type { RankedContent } from '@/services/recommendation';
import { MovieCard } from '@/components/discover/MovieCard';
import { Badge } from '@/components/ui';

interface RecommendedNextProps {
  rankedItems: RankedContent[];
  loading?: boolean;
}

export const RecommendedNext: React.FC<RecommendedNextProps> = ({
  rankedItems,
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">Recommended Next</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-800" />
          ))}
        </div>
      </section>
    );
  }

  if (rankedItems.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Recommended Next</h2>
          <p className="text-xs text-text-muted">
            Ranked deterministically by genre similarity, rating, and recency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {rankedItems.map(({ content, matchResult }) => (
          <div key={content.id} className="relative group">
            {/* Match score badge overlay top right */}
            <div className="absolute top-2 right-2 z-20 pointer-events-none">
              <Badge
                variant="brand"
                className="backdrop-blur-md bg-surface-900/80 text-[10px] font-bold px-2 py-0.5"
              >
                {matchResult.score}% Match
              </Badge>
            </div>

            <MovieCard content={content} />
          </div>
        ))}
      </div>
    </section>
  );
};
