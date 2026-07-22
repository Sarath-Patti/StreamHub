# StreamHub System Architecture

This document details the high-level system architecture, folder organization, module interaction, request handling lifecycle, GraphQL execution pipeline, authentication workflows, and recommendation scoring engine for StreamHub (v1.0 Release).

## Folder Structure

```
StreamHub/
├── frontend/                 # React 19 + Vite + TypeScript Single Page Application
│   ├── src/
│   │   ├── components/       # UI Components & Layouts
│   │   ├── pages/            # View Pages (Home, Catalog, Watchlist, Admin)
│   │   └── main.tsx          # Application Entry Point
│   ├── Dockerfile            # Multi-stage Nginx production container
│   └── vite.config.ts        # Vite build tool configuration
├── backend/                  # Node.js + Express + Apollo Server + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma     # Production database schema with indexes
│   │   └── seed.ts           # Database seeding script
│   ├── src/
│   │   ├── config/           # Centralized environment validation (Zod)
│   │   ├── graphql/          # Root schema, combined resolvers, & context factory
│   │   ├── modules/          # Modular domain architecture
│   │   │   ├── auth/         # Authentication & JWT management
│   │   │   ├── catalog/      # Content, Genres, Seasons, Episodes
│   │   │   ├── watchlist/    # User Watchlist with duplicate prevention
│   │   │   ├── reviews/      # Reviews, 1-5 ratings & distribution metrics
│   │   │   ├── search/       # Multi-criteria search & filtering engine
│   │   │   ├── recommendations/ # Deterministic recommendation algorithms
│   │   │   └── admin/        # RBAC platform administration & moderation
│   │   ├── routes/           # REST endpoints (/api/health, /api/ready)
│   │   ├── shared/           # Single source of truth for infrastructure
│   │   │   ├── constants/    # Application constants
│   │   │   ├── errors/       # AppError hierarchy & GraphQL error formatter
│   │   │   ├── logger/       # Pino structured JSON logger
│   │   │   ├── middleware/   # Express middlewares (CORS, RateLimiter, Security, Auth, Logging)
│   │   │   ├── types/        # Shared TypeScript types
│   │   │   └── validation/   # Zod validation helpers
│   │   └── server.ts         # Express & Apollo Server factory
│   └── tests/                # Unit and GraphQL Integration tests
├── docs/                     # Architectural & module specifications
│   ├── architecture.md       # High-level architecture (this file)
│   ├── engineering.md        # Engineering standards
│   ├── authentication.md     # Auth module details
│   ├── catalog.md            # Catalog module details
│   ├── watchlist.md          # Watchlist module details
│   ├── reviews.md            # Reviews & ratings details
│   ├── search.md             # Search & discovery details
│   ├── recommendations.md    # Recommendation engine details
│   └── admin.md              # Platform administration details
├── docker-compose.yml        # Multi-container orchestra (Frontend, Backend, PostgreSQL)
├── CHANGELOG.md              # Milestone release log
└── README.md                 # Primary project guide
```

## Request Execution Flow

```
Client Request
      │
      ▼
Express Security & Rate Limiting Middleware (Security Headers, Rate Limiter)
      │
      ▼
Request Tracing Middleware (Generates/passes X-Request-Id)
      │
      ▼
Request Logger Middleware (Pino structured duration logging)
      │
      ▼
Authentication Middleware (Decodes Bearer JWT, populates req.user)
      │
      ▼
GraphQL Subsystem (Apollo Server + GraphQL Depth Validation Plugin)
      │
      ▼
GraphQL Context Creation (`createContext` passes { user, logger, req, res })
      │
      ▼
Resolver Layer (Validates RBAC requirements, delegates to Domain Service)
      │
      ▼
Domain Service Layer (Input validation via Zod, applies business logic)
      │
      ▼
Repository Layer (Executes optimized Prisma ORM queries against PostgreSQL)
      │
      ▼
Response Formatter & Error Masking (Sanitizes stack traces in production)
```

## Authentication Flow

1. **Registration/Login**: User sends credentials via `register` or `login` mutation.
2. **Password Verification**: `AuthService` verifies passwords using `bcrypt.compare()`.
3. **Token Issuance**: Generates signed JWT Access Token and Refresh Token containing `{ userId, email, role }`.
4. **Request Authorization**: Client attaches `Authorization: Bearer <token>` header. `authMiddleware` decodes token and sets `req.user`.

## Recommendation Engine Strategy Flow

The engine uses five deterministic strategies without third-party ML dependencies:
- **Similar Content**: Weighted scoring on shared genres (+3), same type (+2), release year proximity (+1), and rating proximity (+1).
- **Popular Content**: Ranks by `ReviewCount * 2.0 + WatchlistCount * 1.5 + Rating * 3.0`.
- **Trending Content**: Weighted scoring on 30-day recent reviews (*3.0), recent watchlists (*2.0), recency bonus, and `isTrending` flag.
- **Top Rated**: Minimum review count threshold filtering sorted by rating descending.
- **Continue Discovering**: Filters out user's reviewed/watchlisted items and scores candidates using user genre affinity plus item ratings.
