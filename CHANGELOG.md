# StreamHub Changelog

All notable changes to the StreamHub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2.0.0 Production Release

### Added
- Complete open-source community governance files (`LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`).
- GitHub Issue templates (`bug_report.md`, `feature_request.md`) and Pull Request template (`PULL_REQUEST_TEMPLATE.md`).
- Release notes document (`docs/ReleaseNotes-v2.0.0.md`) detailing the milestone journey from v1.0.0 through v2.0.0.
- Release readiness checklist document (`docs/ReleaseChecklist.md`).
- Professional README overhaul featuring Mermaid architecture diagram (`graph TD`) and comprehensive technology stack matrix.

### Changed
- Standardized package metadata, descriptions, keywords, author, and version numbers (`2.0.0`) across root, backend, and frontend `package.json` files.
- Refactored imports and cleanups across frontend and backend modules.

---

## [1.8.0] - Production Engineering & Developer Experience

### Added
- Structured, environment-aware `Logger` service (`src/services/logger/`).
- `PerformanceService` latency profiling for search, recommendation scoring, and analytics calculations.
- Centralized configuration management modules (`src/config/`).
- Route code-splitting with `React.lazy` and `Suspense` in `App.tsx` reducing initial bundle size to <470kB.
- Global `ErrorBoundary` enhancement with Logger integration and fallback actions (Retry, Go Home, Report Issue).
- Accessibility (a11y) hardening (`role="dialog"`, `aria-modal="true"`, keyboard `Escape` closing across all modals).
- Comprehensive developer documentation (`docs/Architecture.md`, `docs/DeveloperGuide.md`, `docs/FolderStructure.md`, `docs/EngineeringPatterns.md`).
- Vitest unit test suite covering `SearchRankingEngine`, `RecommendationService`, `AnalyticsAggregator`, and `CollectionService`.

---

## [1.7.0] - Search Intelligence & Personal Discovery

### Added
- Deterministic 0–100 Search Score ranking engine (`SearchRankingEngine`).
- Multi-criteria filter engine (`SearchFilterEngine`) supporting 7 simultaneous parameters.
- Local storage search query history and saved search preset manager (`SearchHistoryService`).
- Search Dashboard page (`/search`) with filter panel, active filter pills, search score inspection modal, and discovery presets.
- Refreshed SaaS Home Page (`/`) landing experience.

---

## [1.6.0] - Analytics & Insights Dashboard

### Added
- Real-time telemetry analytics engine (`AnalyticsService`, `AnalyticsAggregator`).
- Analytics Dashboard page (`/analytics`) featuring 5 KPI cards, genre distribution charts, content format distribution charts, and activity audit logs.

---

## [1.5.0] - Personal Collections & Workspace

### Added
- Workspace collection management (`CollectionService`, `useCollections`, `useCollection`).
- Collections page (`/collections`) and Collection Details view (`/collections/:id`).
- Inline collection creation, item management modal (`AddToCollectionModal`), and GraphQL watchlist synchronization.

---

## [1.4.0] - Explainable Recommendation Engine

### Added
- Strategy Pattern implementation (`RecommendationStrategy`) with 5 concrete algorithms (`Hybrid`, `Genre Similarity`, `Trending`, `Hidden Gems`, `Critics' Choice`).
- Dynamic zero-modification strategy registry (`RecommendationRegistry`).
- Transparent score inspection modal (`WhyExplanationModal`) and side-by-side strategy comparator (`CompareAlgorithmsModal`).

---

## [1.3.0] - Content Intelligence Details

### Added
- Content Details page (`/content/:id`).
- Content Intelligence Panel displaying explainable recommendation reasons based on deterministic candidate metadata.

---

## [1.2.1] - Seed Data Expansion

### Added
- Database expansion to 40 curated catalog items across 10 distinct genres, varying release years (1995–2026), and ratings.

---

## [1.2.0] - Discover Experience

### Added
- Discover page (`/discover`) featuring Trending, Popular, Top Rated, and Recently Released content sections.
- Reusable `MovieCard` component, deep-linked query parameters (`?q=`, `?genre=`), genre filter chips, and pagination.

---

## [1.1.0] - Frontend Architecture Foundation

### Added
- React 19 + Vite + TypeScript + Tailwind CSS frontend application setup.
- React Router v6, Apollo Client GraphQL integration, and JWT Auth Context foundation.

---

## [1.0.0] - Production Backend Release

### Added
- Node.js + Express + Apollo Server 4 + Prisma ORM + PostgreSQL monolithic backend.
- Custom database composite indexes, rate limiting, structured Pino logging, and JWT authentication.
