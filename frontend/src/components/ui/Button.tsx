import React from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ' +
  'transition-all duration-150 focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-brand-400 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 active:bg-brand-600 text-white ' +
    'shadow-md hover:shadow-lg hover:shadow-brand-500/30',
  secondary:
    'bg-surface-700 hover:bg-surface-600 active:bg-surface-600 text-white border border-surface-500',
  ghost:
    'bg-transparent hover:bg-surface-700 text-text-secondary hover:text-white',
  danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-700 text-white',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...rest
}) => (
  <button
    className={[base, variants[variant], sizes[size], className].join(' ')}
    disabled={disabled || loading}
    aria-busy={loading}
    {...rest}
  >
    {loading ? <Spinner size="sm" /> : leftIcon}
    {children}
    {!loading && rightIcon}
  </button>
);
