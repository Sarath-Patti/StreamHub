import React from 'react';
import { Button } from '@/components/ui';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load content. Please try again later.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
    <div className="text-3xl mb-3">⚠️</div>
    <h3 className="text-base font-semibold text-red-400 mb-1">Something went wrong</h3>
    <p className="text-xs text-text-secondary max-w-sm mb-5">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry Query
      </Button>
    )}
  </div>
);
