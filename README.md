# StreamHub

Production-ready, high-performance full-stack streaming platform foundation.

[![CI Workflow](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml/badge.svg)](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

StreamHub is a production-grade full-stack video streaming architecture built with React 19, Vite, TypeScript, Express, Apollo Server (GraphQL), Prisma ORM, and PostgreSQL. It demonstrates clean modular architecture, security hardening, performance indexing, deterministic recommendation algorithms, and operational readiness.

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

## Data Flow Architecture

```
Frontend (React 19 + Vite) -> Apollo Client -> GraphQL API (Apollo Server + Express) -> Service Layer -> Repository Layer -> PostgreSQL (Prisma ORM)
```

## Quick Start with Docker

Start the full production stack (Frontend, Backend, PostgreSQL):

```bash
docker-compose up --build
```

Access endpoints:
- **Frontend App**: http://localhost:3000
- **GraphQL Endpoint**: http://localhost:4000/graphql
- **Health Probe**: http://localhost:4000/api/health
- **Readiness Probe**: http://localhost:4000/api/ready

## Local Development Workflow

### 1. Database Setup & Seeding

```bash
cd backend
npm install
npx prisma generate
npx prisma db seed
```

### 2. Backend Server

```bash
cd backend
npm run dev
```

### 3. Frontend App

```bash
cd frontend
npm install
npm run dev
```

## Testing

Run unit and integration test suites:

```bash
cd backend
npm run test
```

Run linter and TypeScript compilation:

```bash
# Backend
cd backend
npm run lint
npm run build

# Frontend
cd frontend
npm run lint
npm run build
```

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
