import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

const variants = {
  brand:   'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30',
  accent:  'bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/30',
  success: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  error:   'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  neutral: 'bg-surface-600 text-text-secondary ring-1 ring-surface-500',
} as const;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => (
  <span
    className={[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className,
    ].join(' ')}
  >
    {children}
  </span>
);
