# StreamHub Changelog

All notable changes to the StreamHub platform are documented in this file.

---

## [v1.0.0] - Production Release

### Added
- Database indexing on `User`, `Content`, `Season`, `Episode`, `Watchlist`, and `Review` models.
- Express security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`).
- Sliding-window rate-limiting middleware (`X-RateLimit-*`).
- Health (`/api/health`) and database readiness (`/api/ready`) probe endpoints.
- GraphQL depth validation plugin (max depth 8).
- Multi-container `docker-compose.yml` with optimized multi-stage `Dockerfile` and `.dockerignore`.
- Enhanced CI/CD GitHub Actions workflow with dependency caching and parallel jobs.
- Comprehensive system architecture guide in `docs/architecture.md`.

---

## [v0.9.0] - Platform Administration

### Added
- Role-Based Access Control (RBAC) supporting `USER` and `ADMIN` roles.
- Content soft-delete (`isDeleted`, `deletedAt`), restoration, and bulk operations.
- Review moderation (hiding, restoring, admin deletion, reported review tracking).
- Administrative analytics dashboard (`adminDashboard`) providing real-time platform statistics.

---

## [v0.8.0] - Recommendation Engine

### Added
- Deterministic content recommendation algorithms:
  - **Similar Content** (genre, type, year, and rating proximity scoring)
  - **Popular Content** (weighted reviews, watchlists, and rating scoring)
  - **Trending Content** (30-day activity decay scoring)
  - **Top Rated Content** (minimum review threshold filtering)
  - **Continue Discovering** (personalized un-interacted content recommendation)

---

## [v0.7.0] - Search & Discovery Module

### Added
- Multi-criteria content search engine (case-insensitive partial title/description matching).
- Advanced filters by type (`MOVIE`/`SERIES`), genre, release year, language, and minimum rating threshold.
- Pagination metadata (`totalCount`, `totalPages`, `currentPage`, `hasNextPage`, `hasPreviousPage`).

---

## [v0.6.0] - Reviews & Ratings Module

### Added
- Content review submission and star rating (1–5 scale).
- Enforced single review per user per content (`@@unique([userId, contentId])`).
- Average rating aggregation and 5-star distribution metrics.

---

## [v0.5.0] - Watchlist Module

### Added
- Personal watchlist management for authenticated users.
- Database unique constraint (`@@unique([userId, contentId])`) preventing duplicate watchlist additions.
- Paginated watchlist retrieval sorted by recently added.

---

## [v0.4.0] - Content Catalog Module

### Added
- Catalog models (`Content`, `Genre`, `Season`, `Episode`) supporting movies and TV series.
- Catalog repository and service layers for paginated browsing, filtering, and CRUD operations.
- Prisma seed script (`prisma/seed.ts`) populating genres, movies, and series with episode hierarchies.

---

## [v0.3.0] - Authentication & Architecture Refinement

### Added
- User Prisma model with bcrypt password hashing.
- JWT Access and Refresh token generation, validation, and renewal flow.
- Domain module architecture (`modules/auth`, `modules/catalog`, etc.).

---

## [v0.2.0] - Engineering Foundation

### Added
- Pino structured JSON logging with request ID correlation.
- Fail-fast Zod environment validation.
- Standardized error hierarchy (`AppError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`).

---

## [v0.1.0] - Project Foundation

### Added
- Initialized full-stack monorepo layout (`frontend/` React 19 + Vite, `backend/` Express + Apollo Server + Prisma).
- Base GraphQL schema and status query.
