# StreamHub System Architecture

StreamHub is designed around a modular, 7-layer service-oriented frontend and backend architecture:

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

## Layer Responsibilities

1. **Presentation Layer (`src/pages`, `src/components`)**: Pure React UI components. Zero business or scoring logic.
2. **GraphQL Layer (`src/graphql`)**: Apollo Client initialization, GraphQL queries/mutations, typePolicies, and authorization header link.
3. **Recommendation Engine (`src/services/recommendation`)**: Strategy Pattern (`RecommendationStrategy`) & Dynamic Strategy Registry (`RecommendationRegistry`).
4. **Collection Workspace Service (`src/services/collection`)**: State CRUD, event listeners, local storage persistence, and GraphQL watchlist sync.
5. **Analytics Telemetry Service (`src/services/analytics`)**: Metric aggregations (`AnalyticsAggregator`), activity event tracking (`AnalyticsEvent`), and memoization cache.
6. **Search Intelligence Service (`src/services/search`)**: Multi-criteria `SearchFilterEngine` & deterministic `SearchRankingEngine` (0–100 match score).
7. **Backend Infrastructure (`backend/src`)**: Express, Apollo Server 4, Prisma ORM, JWT auth, Pino logging, and PostgreSQL with composite database indexes.
