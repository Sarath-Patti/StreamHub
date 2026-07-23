import React from 'react';
import type { Content } from '@/types';
import { MovieCard } from './MovieCard';
import { MovieSkeletonGrid } from './MovieSkeleton';

interface DiscoverSectionProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  items: Content[];
  loading?: boolean;
  emptyMessage?: string;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({
  title,
  icon,
  subtitle,
  items,
  loading = false,
  emptyMessage = 'No items found in this section.',
}) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-xl">{icon}</span>}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Content Grid / Skeletons */}
      {loading ? (
        <MovieSkeletonGrid count={6} />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-surface-700/50 bg-surface-800/40 p-8 text-center text-sm text-text-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => (
            <MovieCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </section>
  );
};
