# StreamHub

Production-ready, high-performance full-stack video streaming platform foundation.

[![CI Workflow](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml/badge.svg)](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Quick Start (One Command)

```bash
git clone https://github.com/Sarath-Patti/StreamHub.git
cd StreamHub
docker compose up --build
```

Open your browser at **http://localhost:3000**

- **Frontend App**: http://localhost:3000
- **GraphQL Endpoint**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/api/health
- **Readiness Check**: http://localhost:4000/api/ready

---

## Developer Workflows

### Monorepo Scripts (Root)

From the project root:

```bash
npm run dev        # Starts Frontend & Backend concurrently
npm run build      # Builds Backend & Frontend
npm run test       # Runs Backend test suite
npm run lint       # Lints Backend & Frontend code
npm run docker     # Runs docker compose up --build
npm run clean      # Cleans node_modules and build artifacts
```

### Local Development (Without Docker)

1. **Start PostgreSQL**: Ensure PostgreSQL is running on port `5432` with database `streamhub`.
2. **Setup Database**:
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```
3. **Run Application**:
   ```bash
   # From root directory
   npm run dev
   ```

---

## Overview

StreamHub is a production-grade full-stack video streaming architecture built with React 19, Vite, TypeScript, Express, Apollo Server (GraphQL), Prisma ORM, and PostgreSQL. It features clean modular architecture, security hardening, performance indexing, deterministic recommendation algorithms, and operational readiness.

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Apollo Client, React Router
- **Backend**: Node.js (LTS), Express, Apollo Server (GraphQL), Prisma ORM, PostgreSQL
- **Security & Infrastructure**: Pino structured logging, Zod validation, JWT authentication, sliding-window rate limiting, security headers, Vitest
- **Deployment**: Docker, Docker Compose, GitHub Actions CI/CD

## Architecture & Modules

- **Authentication Module**: JWT access and refresh token authentication with bcrypt password hashing.
- **Content Catalog Module**: Movies, TV Series, Seasons, Episodes, and Genres management with pagination and trending flags.
- **Watchlist Module**: Personal watchlist management with database-level duplicate prevention (`@@unique([userId, contentId])`).
- **Reviews & Ratings Module**: 1–5 star ratings, review text, average rating calculation, and star distribution metrics.
- **Search & Discovery Module**: Multi-criteria search, filtering (genre, type, language, year, min rating), sorting, and pagination metadata.
- **Recommendation Engine Module**: Deterministic recommendation strategies (Similar Content, Popular Content, Weighted Trending, Top Rated with minimum reviews, and Continue Discovering).
- **Platform Administration Module**: RBAC protection (`USER` vs `ADMIN`), soft-delete lifecycle, bulk operations, review moderation, and platform analytics dashboard.

For detailed architecture docs, see:
- [docs/architecture.md](docs/architecture.md)
- [docs/engineering.md](docs/engineering.md)
- [docs/admin.md](docs/admin.md)
- [docs/recommendations.md](docs/recommendations.md)
- [docs/search.md](docs/search.md)
- [docs/reviews.md](docs/reviews.md)
- [docs/watchlist.md](docs/watchlist.md)
- [docs/catalog.md](docs/catalog.md)
- [docs/authentication.md](docs/authentication.md)
- [CHANGELOG.md](CHANGELOG.md)

## Example GraphQL API Operations

### Search & Discover Content
```graphql
query DiscoverSciFi {
  discover(input: {
    type: MOVIE
    genre: "Sci-Fi"
    minimumRating: 8.0
    page: 1
    limit: 10
  }) {
    totalCount
    totalPages
    results {
      id
      title
      rating
      releaseYear
    }
  }
}
```

### Add to Watchlist
```graphql
mutation AddMovieToWatchlist {
  addToWatchlist(contentId: "content-uuid-123") {
    id
    createdAt
    content {
      title
    }
  }
}
```

## License

[MIT](LICENSE)
