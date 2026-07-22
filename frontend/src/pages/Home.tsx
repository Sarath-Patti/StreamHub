import React from 'react';
import { Badge, Spinner } from '@/components/ui';
import { useStatus } from '@/hooks/useStatus';

/* ─── Feature card data ──────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🎬',
    title: 'Curated Catalog',
    description:
      'Thousands of movies and series, organized and enriched with metadata, genres, and ratings.',
  },
  {
    icon: '🔍',
    title: 'Powerful Search',
    description:
      'Find exactly what you want with full-text search, genre filters, and content-type facets.',
  },
  {
    icon: '📋',
    title: 'Personal Watchlist',
    description:
      'Bookmark titles and pick up right where you left off — synced across all sessions.',
  },
  {
    icon: '⭐',
    title: 'Reviews & Ratings',
    description:
      'Leave your take on any title and explore community opinions before you watch.',
  },
  {
    icon: '✨',
    title: 'Recommendations',
    description:
      'Intelligent suggestions powered by your watchlist, reviews, and viewing patterns.',
  },
  {
    icon: '🛡️',
    title: 'Secure by Default',
    description:
      'JWT authentication with RBAC, rate limiting, and hardened security headers throughout.',
  },
] as const;

/* ─── Status indicator ───────────────────────────────────────────── */
const StatusPill: React.FC = () => {
  const { status, loading, error } = useStatus();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-surface-600 px-4 py-1.5 text-xs text-text-muted">
        <Spinner size="sm" />
        Connecting to backend…
      </span>
    );
  }

  if (error || !status) {
    return (
      <Badge variant="error" className="px-4 py-1.5 text-xs">
        Backend unavailable
      </Badge>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs text-green-400">
      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
      {status}
    </span>
  );
};

/* ─── Page ───────────────────────────────────────────────────────── */
const Home: React.FC = () => (
  <div className="flex flex-col">
    {/* Hero */}
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-4 py-24 sm:py-36 lg:py-48 text-center"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl animate-fade-in">
        <div className="mb-6 flex justify-center">
          <StatusPill />
        </div>

        <h1
          id="hero-heading"
          className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Stream<span className="gradient-text">Hub</span>{' '}
          <span className="block text-text-secondary text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2">
            initialized.
          </span>
        </h1>

        <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto">
          A production-ready streaming platform with search, watchlists, reviews,
          and intelligent recommendations — built with GraphQL and React.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Badge variant="brand" className="px-4 py-2 text-sm">
            v1.1 — Frontend Foundation
          </Badge>
          <Badge variant="neutral" className="px-4 py-2 text-sm">
            Apollo Client connected
          </Badge>
          <Badge variant="neutral" className="px-4 py-2 text-sm">
            React Router ready
          </Badge>
        </div>
      </div>
    </section>

    {/* Feature grid */}
    <section
      aria-labelledby="features-heading"
      className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8"
    >
      <h2
        id="features-heading"
        className="mb-12 text-center text-3xl font-bold text-white"
      >
        Platform Capabilities
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon, title, description }) => (
          <article
            key={title}
            className="glass-card p-6 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-brand"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-2xl">
              {icon}
            </div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
