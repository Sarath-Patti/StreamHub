import React from 'react';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content found',
  description = 'We couldn\'t find any movies or series matching your current search criteria.',
  onResetFilters,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-700/60 bg-surface-800/40 p-12 text-center shadow-inner">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-700/60 text-3xl mb-4">
      🔍
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-sm text-text-secondary max-w-md mb-6">{description}</p>
    {onResetFilters && (
      <Button variant="secondary" size="md" onClick={onResetFilters}>
        Reset Filters
      </Button>
    )}
  </div>
);
