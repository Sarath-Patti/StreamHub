import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Badge } from '@/components/ui';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(isAuthenticated
      ? [
          { to: '/discover', label: 'Discover' },
          { to: '/collections', label: 'Collections' },
        ]
      : []),
  ];

  return (
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
          {navLinks.map(({ to, label }) => (
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

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-full bg-surface-800 border border-surface-700 py-1 pl-1.5 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                <Badge variant={user.role === 'ADMIN' ? 'accent' : 'neutral'} className="text-[10px] px-2 py-0">
                  {user.role}
                </Badge>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
