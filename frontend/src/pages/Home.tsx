import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Spinner } from '@/components/ui';
import { useStatus } from '@/hooks/useStatus';
import { collectionService } from '@/services/collection';
import { searchService } from '@/services/search';
import { recommendationRegistry } from '@/services/recommendation';

/* ─── Status Pill Component ───────────────────────────────────────── */
const StatusPill: React.FC = () => {
  const { status, loading, error } = useStatus();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-surface-600 px-4 py-1.5 text-xs text-text-muted bg-surface-800/80">
        <Spinner size="sm" />
        Connecting to GraphQL backend…
      </span>
    );
  }

  if (error || !status) {
    return (
      <Badge variant="error" className="px-4 py-1.5 text-xs">
        Backend disconnected
      </Badge>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400 backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      {status}
    </span>
  );
};

/* ─── Feature Highlights Data ─────────────────────────────────────── */
const PLATFORM_HIGHLIGHTS = [
  {
    icon: '🧠',
    title: 'Explainable Recommendations',
    description:
      'Transparent recommendation engine using the Strategy Pattern and 100-point deterministic match scoring.',
  },
  {
    icon: '🔍',
    title: 'Search Intelligence',
    description:
      'Advanced multi-criteria filtering, ranking engine, explainable search, saved searches, and history telemetry.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description:
      'Real-time insights into workspace collections, recommendation accuracy, genre taxonomy, and discovery trends.',
  },
  {
    icon: '📚',
    title: 'Collections Workspace',
    description:
      'Organize content into reusable personal collections with dedicated service architecture and reactive state.',
  },
] as const;

/* ─── Engineering Highlights Data ─────────────────────────────────── */
const ENGINEERING_HIGHLIGHTS = [
  {
    icon: '⚡',
    title: 'Strategy Pattern',
    description:
      'Pluggable recommendation algorithm evaluation classes handling genre, rating, trending, and recency factors.',
  },
  {
    icon: '🧩',
    title: 'Registry Pattern',
    description:
      'Dynamic strategy discovery and lookup registry enabling zero-modification algorithm extensions.',
  },
  {
    icon: '🛠️',
    title: 'Service Layer',
    description:
      'Clean decoupling of business logic in dedicated services (SearchService, AnalyticsService, CollectionService).',
  },
  {
    icon: '🌐',
    title: 'Apollo GraphQL',
    description:
      'Declarative queries, mutations, typePolicies, and reactive cache management with zero duplicate data fetching.',
  },
  {
    icon: '💾',
    title: 'Memoization',
    description:
      'Performance-optimized score calculation and aggregation caching avoiding redundant component rerenders.',
  },
  {
    icon: '🧱',
    title: 'Modular Architecture',
    description:
      'Strict separation of presentation components, custom hooks, service domain layers, and GraphQL APIs.',
  },
] as const;

/* ─── Tech Stack Grid Items ───────────────────────────────────────── */
const TECH_STACK = [
  'React 19',
  'TypeScript',
  'GraphQL',
  'Apollo Client',
  'Vite',
  'Tailwind CSS',
  'Service Layer',
  'Strategy Pattern',
  'Registry Pattern',
  'Custom Hooks',
  'Memoization',
  'Responsive Design',
] as const;

/* ─── Home Page Component ─────────────────────────────────────────── */
const Home: React.FC = () => {
  // Compute real statistics from underlying domain services
  const totalStrategies = recommendationRegistry.getAll().length;
  const totalCollections = collectionService.getCollections().length;
  const totalSavedSearches = searchService.getSavedSearches().length;

  const stats = [
    { value: `${totalStrategies}`, label: 'Recommendation Strategies', subtext: 'Hybrid, Genre, Trending, Gems, Critics' },
    { value: `${totalCollections}`, label: 'Collection Workspaces', subtext: 'Personal user collections' },
    { value: `${totalSavedSearches}`, label: 'Saved Search Presets', subtext: 'Re-runnable discovery presets' },
    { value: '4', label: 'Analytics Telemetry Modules', subtext: 'Genre, Format, Stats, Audit' },
    { value: '7', label: 'Search Criteria Filters', subtext: 'Title, Genre, Type, Year, Rating, Runtime, Language' },
    { value: '4', label: 'Core Service Modules', subtext: 'Recommendation, Collection, Analytics, Search' },
  ];

  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 py-8 animate-fade-in">
      {/* 1. Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden px-4 py-16 sm:py-24 text-center rounded-3xl bg-surface-800/40 border border-surface-700/60 shadow-2xl"
      >
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[450px] w-[450px] rounded-full bg-brand-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl space-y-6">
          <div className="flex justify-center">
            <StatusPill />
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white"
          >
            Content <span className="gradient-text">Intelligence</span> Platform
          </h1>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover, organize, analyze, and search content using explainable recommendation systems,
            intelligent collections, analytics dashboards, and advanced discovery—all built with React,
            TypeScript, GraphQL, and modern software engineering principles.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link to="/discover">
              <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
                Explore Content
              </Button>
            </Link>

            <Link to="/search">
              <Button variant="secondary" size="lg">
                🔍 Search Intelligence
              </Button>
            </Link>

            <Link to="/analytics">
              <Button variant="ghost" size="lg">
                📊 View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platform Highlights */}
      <section aria-labelledby="highlights-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 id="highlights-heading" className="text-2xl sm:text-3xl font-bold text-white">
            Platform Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
            Core functional pillars driving StreamHub's discovery experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_HIGHLIGHTS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="glass-card p-6 flex flex-col justify-between space-y-4 border border-surface-700/60 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-2xl">
                {icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Engineering Highlights */}
      <section aria-labelledby="engineering-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 id="engineering-heading" className="text-2xl sm:text-3xl font-bold text-white">
            Engineering Highlights
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
            Architectural design patterns and frontend engineering practices.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_HIGHLIGHTS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-surface-800/80 border border-surface-700/60 p-6 flex flex-col space-y-3 transition-all duration-300 hover:border-surface-600 shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-700 text-lg">
                  {icon}
                </span>
                <h3 className="text-sm font-bold text-white">{title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Visual Architecture Preview */}
      <section aria-labelledby="architecture-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-3xl bg-surface-800/90 border border-surface-700/60 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 id="architecture-heading" className="text-2xl sm:text-3xl font-bold text-white">
              Layered System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
              StreamHub implements a clean, layered service-oriented architecture. Presentation components
              consume domain services, which interface with Apollo GraphQL and backend services to process
              deterministic recommendations, custom collection storage, telemetry aggregations, and multi-criteria search ranking.
            </p>
          </div>

          {/* Architecture Flowchart Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 pt-4 overflow-x-auto pb-2">
            {[
              { label: 'Frontend', icon: '💻' },
              { label: 'GraphQL', icon: '🌐' },
              { label: 'Recommendation Engine', icon: '🎯' },
              { label: 'Collection Service', icon: '📚' },
              { label: 'Analytics Service', icon: '📊' },
              { label: 'Search Service', icon: '🔍' },
              { label: 'Backend', icon: '⚙️' },
            ].map((layer, idx, arr) => (
              <React.Fragment key={layer.label}>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-900 border border-surface-700/70 p-3 sm:p-4 min-w-[120px] text-center shadow-md">
                  <span className="text-xl mb-1">{layer.icon}</span>
                  <span className="text-xs font-bold text-white">{layer.label}</span>
                </div>

                {idx < arr.length - 1 && (
                  <span className="text-brand-300 font-extrabold text-lg rotate-90 md:rotate-0 my-1 md:my-0">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Platform Statistics */}
      <section aria-labelledby="stats-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold text-white">
            Platform Metrics
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Live telemetry metrics computed from domain services.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ value, label, subtext }) => (
            <div
              key={label}
              className="rounded-2xl bg-surface-800/80 border border-surface-700/60 p-4 text-center space-y-1 shadow-md"
            >
              <p className="text-3xl font-black text-white gradient-text">{value}</p>
              <p className="text-xs font-bold text-white leading-tight">{label}</p>
              <p className="text-[10px] text-text-muted truncate">{subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Technology Stack Grid */}
      <section aria-labelledby="tech-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 id="tech-heading" className="text-2xl sm:text-3xl font-bold text-white">
            Technology Stack & Practices
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-xl bg-surface-800/90 border border-surface-700/70 px-4 py-2 text-xs font-bold text-text-secondary hover:text-white hover:border-brand-500/50 transition-colors shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 7. Call To Action (Final Section) */}
      <section aria-labelledby="cta-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900/60 via-surface-800 to-purple-900/60 border border-brand-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Start Discovering Smarter
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Explore content catalog, run intelligent multi-criteria searches, build workspace collections,
              and inspect analytics dashboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 pt-2">
            <Link to="/discover">
              <Button variant="primary" size="md">
                Explore Content
              </Button>
            </Link>

            <Link to="/search">
              <Button variant="secondary" size="md">
                Search Intelligence
              </Button>
            </Link>

            <Link to="/analytics">
              <Button variant="secondary" size="md">
                View Analytics
              </Button>
            </Link>

            <Link to="/collections">
              <Button variant="ghost" size="md">
                Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
