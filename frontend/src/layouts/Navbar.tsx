import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',     label: 'Home'     },
  { to: '/browse', label: 'Browse'   },
] as const;

export const Navbar: React.FC = () => (
  <header className="sticky top-0 z-50 w-full border-b border-surface-700/60 bg-surface-900/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-md"
        aria-label="StreamHub home"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm select-none">
          S
        </span>
        <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
          Stream<span className="gradient-text">Hub</span>
        </span>
      </Link>

      {/* Nav links */}
      <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-700 text-white'
                  : 'text-text-secondary hover:text-white hover:bg-surface-700/60',
              ].join(' ')
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Actions placeholder */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted px-3 py-1.5 rounded-full border border-surface-600 select-none">
          v1.1
        </span>
      </div>
    </div>
  </header>
);
