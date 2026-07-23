# StreamHub

Production-ready, high-performance **Content Intelligence & Discovery Platform** built with React 19, Vite, TypeScript, Express, Apollo Server (GraphQL), Prisma ORM, and PostgreSQL.

[![CI Workflow](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml/badge.svg)](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml)
[![Version: 1.6.0](https://img.shields.io/badge/Version-v1.6.0-blue.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

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

## System Architecture

StreamHub isolates analytics data aggregation, recommendation strategy evaluation, and workspace collections into modular service layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          StreamHub Web App                             │
│                         (React 19 + Vite)                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             GraphQL Layer                              │
│                    (Apollo Client + Type Policies)                     │
└─────────┬─────────────────────────┬──────────────────────────┬─────────┘
          │                         │                          │
          ▼                         ▼                          ▼
┌──────────────────┐    ┌───────────────────────┐    ┌──────────────────┐
│  Recommendation  │    │  Collection Service   │    │Analytics Service │
│      Engine      │    │  (Workspace & Sync)   │    │  (Telemetry &    │
│(Strategy/Registry│    └───────────┬───────────┘    │  Aggregations)   │
└─────────┬────────┘                │                └─────────┬────────┘
          │                         │                          │
          └─────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             Backend Service                            │
│           (Node.js + Express + Apollo Server + Prisma ORM)             │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           PostgreSQL Database                          │
│               (Database Indexes + Hardened Constraints)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Platform Features

- 📊 **Analytics & Insights Dashboard**: Real-time telemetry (`/analytics`) visualizing collection statistics, genre distribution, format breakdown, and activity audit logs.
- 🎯 **Explainable Recommendation Engine**: 100-point transparent match scoring breakdown across 5 dimensions (Genre Similarity 40, Rating Weight 25, Popularity 15, Recency 10, Diversity 10).
- 🧩 **Pluggable Strategy Selector**: Instant algorithm switching (`Hybrid`, `Genre Similarity`, `Trending`, `Hidden Gems`, `Critics' Choice`) without page refreshes.
- 📊 **Algorithm Comparator**: Side-by-side strategy score comparison tool evaluating content against all registered algorithms.
- 📚 **Personal Collections Workspace**: Custom collection management (`/collections`, `/collections/:id`) with inline collection creation, search filtering, and item management.
- 🔎 **Rich Discover Experience**: Deep-linking search (`?q=`), genre filtering chips, type switching, sorting, and pagination.
- 🔒 **Enterprise Authentication**: JWT access and refresh token flow with sliding-window protection and automatic Apollo client authorization.
- ⚡ **Database & Backend Hardening**: Custom Prisma composite indexes (`@@index([title, releaseYear])`, `@@index([rating])`), rate limiting, structured logging, health probes.

---

## Engineering Highlights

### 1. Analytics Aggregation & Telemetry Engine
The `AnalyticsService` and `AnalyticsAggregator` process real-time events (`AnalyticsEvent`), calculate genre taxonomy share, format ratios, and collection size dynamics.

### 2. Service Calculation Memoization
Expensive calculations (genre frequency distribution, recommendation score confidence indexes) are memoized inside `AnalyticsService` and `RecommendationService` caches to prevent redundant rerenders.

### 3. Strategy Pattern & Dynamic Strategy Registry
Recommendation algorithms are structured using the Strategy Pattern (`RecommendationStrategy`). The `RecommendationRegistry` allows new algorithms to be registered dynamically at runtime with zero modification to existing codebase logic.

### 4. Decoupled Service-Layer Architecture
All business logic, score calculations, strategy evaluation, collection state, and analytics summaries are completely isolated from React components in dedicated service modules (`AnalyticsService`, `RecommendationService`, `CollectionService`).

### 5. Apollo Client & Reactive State Synchronization
Apollo Client `InMemoryCache` typePolicies manage cache identity for `Content`, `Genre`, and `Watchlist` entities. Local collection state updates reactively broadcast to UI components via event subscriptions.

---

## Screenshots Placeholder

> [!NOTE]
> Screenshot assets will be placed under `./docs/screenshots/`.

| Analytics Dashboard | Discover Workspace |
|:---:|:---:|
| ![Analytics Dashboard](./docs/screenshots/analytics.png) | ![Discover Page](./docs/screenshots/discover.png) |

| Explainable Recommendation Score | Personal Collections |
|:---:|:---:|
| ![Recommendation Score](./docs/screenshots/intelligence.png) | ![Personal Collections](./docs/screenshots/collections.png) |

---

## Milestone Roadmap

- [x] **v1.0.0** — Monolithic Backend, Security Hardening, Database Indexing & Operational Readiness
- [x] **v1.0.1** — One-Command Docker Startup & Developer Experience Update
- [x] **v1.1.0** — Frontend Architecture Foundation (React 19 + Vite + Tailwind + Apollo Client)
- [x] **v1.2.0** — Discover Experience & Deep-linked Filtering
- [x] **v1.2.1** — Seed Data Expansion (40 catalog items across 10 genres)
- [x] **v1.3.0** — Content Intelligence Page (`/content/:id`)
- [x] **v1.4.0** — Explainable Recommendation Engine & Strategy Registry
- [x] **v1.5.0** — Personal Collections & Discovery Workspace (`/collections`)
- [x] **v1.6.0** — Analytics & Insights Dashboard (`/analytics`)

---

## Repository Structure

```
StreamHub/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── modules/ (auth, catalog, watchlist, reviews, search, recommendation, admin)
│   │   ├── shared/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ (analytics, auth, collections, discover, intelligence, ui)
│   │   ├── graphql/ (client, auth, content, discover, watchlist)
│   │   ├── hooks/ (useAnalytics, useAuth, useCollections, useCollection)
│   │   ├── layouts/ (Navbar, RootLayout)
│   │   ├── pages/ (Analytics, CollectionDetails, Collections, ContentDetails, Discover, Home, Login, Register)
│   │   ├── services/ (analytics, collection, recommendation)
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## License

[MIT](LICENSE)
