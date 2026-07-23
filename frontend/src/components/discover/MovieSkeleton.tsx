import React from 'react';

interface MovieSkeletonProps {
  count?: number;
}

export const MovieSkeletonCard: React.FC = () => (
  <div className="flex flex-col overflow-hidden rounded-xl bg-surface-800 border border-surface-700/50 shadow-md animate-pulse">
    {/* Poster aspect skeleton */}
    <div className="aspect-[2/3] w-full bg-surface-700/60" />
    {/* Info skeleton */}
    <div className="p-3.5 space-y-2">
      <div className="h-4 w-3/4 rounded bg-surface-700/80" />
      <div className="h-3 w-1/2 rounded bg-surface-700/50" />
    </div>
  </div>
);

export const MovieSkeletonGrid: React.FC<MovieSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieSkeletonCard key={i} />
      ))}
    </div>
  );
};
