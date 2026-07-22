# StreamHub Engineering Foundation

This document details the engineering principles, infrastructure, and standards established across milestones v0.2, v0.3, and v0.4.

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
│   └── catalog/     # Content Catalog feature module
│       ├── graphql/    # Catalog schema definitions and resolvers
│       ├── repository/ # Data access layer for Content, Genre, Season, Episode
│       ├── service/    # Business logic, pagination, search & filtering
│       ├── types/      # Catalog DTOs & TypeScript types
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
│   └── health/     # Health check smoke tests
└── unit/
    ├── auth/       # Unit tests for password hashing, tokens, and services
    └── catalog/    # Unit tests for catalog service & pagination
```
