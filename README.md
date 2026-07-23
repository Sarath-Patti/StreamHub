# StreamHub

Production-ready, high-performance **Content Intelligence & Discovery Platform** built with React 19, Vite, TypeScript, Express, Apollo Server (GraphQL), Prisma ORM, and PostgreSQL.

[![CI Workflow](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml/badge.svg)](https://github.com/Sarath-Patti/StreamHub/actions/workflows/ci.yml)
[![Version: 1.7.0](https://img.shields.io/badge/Version-v1.7.0-blue.svg)](CHANGELOG.md)
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

StreamHub isolates search intelligence, analytics data aggregation, recommendation strategy evaluation, and workspace collections into modular service layers:

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
└─────┬─────────────┬───────────────────┬───────────────────┬────────────┘
      │             │                   │                   │
      ▼             ▼                   ▼                   ▼
┌───────────┐ ┌───────────┐     ┌───────────────┐   ┌────────────────┐
│Recommen-  │ │Collection │     │   Analytics   │   │ Search Service │
│ dation    │ │  Service  │     │    Service    │   │(Filter/Ranking │
│  Engine   │ │ (Sync)    │     │  (Telemetry)  │   │    Engine)     │
└─────┬─────┘ └─────┬─────┘     └───────┬───────┘   └───────┬────────┘
      │             │                   │                   │
      └─────────────┴─────────┬─────────┴───────────────────┘
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

- 🚀 **Modern SaaS Landing Page (`/`)**: Refreshed Content Intelligence Platform landing experience with feature showcases, engineering highlights, architecture flowchart, live telemetry stats, and CTA navigation.
- 🔍 **Search Intelligence & Personal Discovery**: Deterministic 0–100 Search Score ranking engine (`/search`), multi-criteria filters, saved searches, search history, and intelligent discovery presets.
- 📊 **Analytics & Insights Dashboard**: Real-time telemetry (`/analytics`) visualizing collection statistics, genre distribution, format breakdown, and activity audit logs.
- 🎯 **Explainable Recommendation Engine**: 100-point transparent match scoring breakdown across 5 dimensions (Genre Similarity 40, Rating Weight 25, Popularity 15, Recency 10, Diversity 10).
- 🧩 **Pluggable Strategy Selector**: Instant algorithm switching (`Hybrid`, `Genre Similarity`, `Trending`, `Hidden Gems`, `Critics' Choice`) without page refreshes.
- 📊 **Algorithm Comparator**: Side-by-side strategy score comparison tool evaluating content against all registered algorithms.
- 📚 **Personal Collections Workspace**: Custom collection management (`/collections`, `/collections/:id`) with inline collection creation, search filtering, and item management.
- 🔎 **Rich Discover Experience**: Deep-linking search (`?q=`), genre filtering chips, type switching, sorting, and pagination.
- 🔒 **Enterprise Authentication**: JWT access and refresh token flow with sliding-window protection and automatic Apollo client authorization.
- ⚡ **Database & Backend Hardening**: Custom Prisma composite indexes (`@@index([title, releaseYear])`, `@@index([rating])`), rate limiting, structured logging, health probes.

---

## Search Intelligence & Scoring Mechanics

The `SearchRankingEngine` scores candidates on a **0–100 scale** using a deterministic multi-factor formula:

$$\text{Search Score} = \text{TitleMatch (35)} + \text{GenreAlignment (20)} + \text{RatingWeight (20)} + \text{Popularity (15)} + \text{CollectionAffinity (10)}$$

- **Title Match (35 pts)**: Exact string match = 35 pts; prefix match = 30 pts; substring match = 24 pts; description match = 15 pts.
- **Genre Alignment (20 pts)**: Overlap ratio with user-selected genre filters or core genre taxonomy.
- **Rating Weight (20 pts)**: Scaled community score ($\frac{\text{Rating}}{10} \times 20$).
- **Popularity (15 pts)**: 15 pts for active trending titles; 8 pts for standard catalog items.
- **Collection Affinity (10 pts)**: 10 pts if title exists inside user's saved workspace collections.

Every result exposes transparent inspection highlights (`✓ Exact title match`, `✓ Rating above 8.5`, `✓ Similar to your saved collections`).

---

## Engineering Highlights

### 1. Deterministic Search Ranking & Filter Engines
The `SearchFilterEngine` evaluates 7 multi-criteria dimensions simultaneously without external search engine dependencies. The `SearchRankingEngine` computes consistent, reproducible match scores out of 100 points.

### 2. Analytics Aggregation & Telemetry Engine
The `AnalyticsService` and `AnalyticsAggregator` process real-time events (`AnalyticsEvent`), calculate genre taxonomy share, format ratios, and collection size dynamics.

### 3. Service Calculation Memoization
Expensive calculations (genre frequency distribution, search scores, recommendation confidence indexes) are memoized inside service layer caches to prevent redundant rerenders.

### 4. Strategy Pattern & Dynamic Strategy Registry
Recommendation algorithms are structured using the Strategy Pattern (`RecommendationStrategy`). The `RecommendationRegistry` allows new algorithms to be registered dynamically at runtime with zero modification to existing codebase logic.

### 5. Decoupled Service-Layer Architecture
All business logic, score calculations, search rankings, strategy evaluation, collection state, and analytics summaries are completely isolated from React components in dedicated service modules (`SearchService`, `AnalyticsService`, `RecommendationService`, `CollectionService`).

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
- [x] **v1.7.0** — Search Intelligence & Personal Discovery (`/search`)

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
│   │   ├── components/ (analytics, auth, collections, discover, intelligence, search, ui)
│   │   ├── graphql/ (client, auth, content, discover, watchlist)
│   │   ├── hooks/ (useAnalytics, useAuth, useCollections, useCollection, useSearch)
│   │   ├── layouts/ (Navbar, RootLayout)
│   │   ├── pages/ (Analytics, CollectionDetails, Collections, ContentDetails, Discover, Home, Login, Register, SearchDashboard)
│   │   ├── services/ (analytics, collection, recommendation, search)
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## License

[MIT](LICENSE)
