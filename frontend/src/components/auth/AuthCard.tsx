import React from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => (
  <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
    <div className="w-full max-w-md animate-fade-in">
      <div className="glass-card p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-bold text-white shadow-lg shadow-brand-500/40 mb-4 hover:scale-105 transition-transform"
          >
            S
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        </div>

        {children}

        {footerText && footerLinkText && footerLinkTo && (
          <div className="mt-8 border-t border-surface-700/60 pt-6 text-center text-sm text-text-secondary">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors underline-offset-4 hover:underline"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);
