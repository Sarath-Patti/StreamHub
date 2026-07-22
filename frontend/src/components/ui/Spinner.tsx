import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
} as const;

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => (
  <span
    role="status"
    aria-label="Loading"
    className={[
      sizeMap[size],
      'inline-block rounded-full border-2 border-surface-500 border-t-brand-400',
      'animate-spin-slow',
      className,
    ].join(' ')}
    style={{ animation: 'spin 1.2s linear infinite' }}
  />
);
