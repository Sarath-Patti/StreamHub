# StreamHub Engineering Foundation

This document details the engineering principles, infrastructure, and standards established across milestones v0.2 through v0.5.

## Backend Organization

The backend source is organized under `backend/src/`:

```
backend/src/
├── config/          # Environment configuration & Zod validation
├── graphql/         # Application GraphQL setup (context, combined schema & resolvers)
│   ├── context/     # GraphQL context factory
│   ├── resolvers/   # Consolidated resolver tree
│   └── schema/      # Consolidated schema definitions
├── modules/         # Domain feature modules
│   ├── auth/        # Authentication feature module
│   ├── catalog/     # Content Catalog feature module
│   └── watchlist/   # User Watchlist feature module
│       ├── graphql/    # Watchlist schema definitions and resolvers
│       ├── repository/ # Data access layer for Watchlist model
│       ├── service/    # Business logic, duplicate prevention & pagination
│       ├── types/      # Watchlist DTOs & TypeScript types
│       └── validation/ # Zod validation schemas
├── routes/          # Express route handlers (e.g. health)
├── shared/          # Single source of truth for reusable infrastructure
│   ├── constants/   # System-wide constants
│   ├── errors/      # Application errors & error formatters
│   ├── logger/      # Pino logger configuration
│   ├── middleware/  # Express middlewares
│   ├── types/       # Shared TypeScript types
│   ├── utils/       # Common helper utilities
│   └── validation/  # Zod validation helpers
└── server.ts        # Express & Apollo Server factory and starter
```

## Testing Infrastructure

Tests are organized into structured directories:

```
tests/
├── integration/
│   ├── auth/       # Authentication integration tests
│   ├── catalog/    # Catalog GraphQL integration tests
│   ├── health/     # Health check smoke tests
│   └── watchlist/  # Watchlist integration & authorization tests
└── unit/
    ├── auth/       # Unit tests for password hashing, tokens, and services
    ├── catalog/    # Unit tests for catalog service & pagination
    └── watchlist/  # Unit tests for watchlist service & duplicate prevention
```
