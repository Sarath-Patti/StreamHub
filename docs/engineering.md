# StreamHub Engineering Foundation

This document details the engineering principles, infrastructure, and standards established across milestones v0.2 and v0.3.

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
│   └── auth/        # Authentication feature module
│       ├── graphql/ # Module-specific typeDefs and resolvers
│       ├── repository/ # Prisma data access layer
│       ├── service/ # Business logic & auth workflows
│       ├── types/   # Module DTOs & TypeScript types
│       └── validation/ # Zod validation schemas
├── routes/          # Express route handlers (e.g. health)
├── shared/          # Single source of truth for reusable infrastructure
│   ├── constants/   # System-wide constants
│   ├── errors/      # Application errors & error formatters
│   ├── logger/      # Pino logger configuration
│   ├── middleware/  # Single-responsibility Express middlewares
│   │   ├── auth.ts          # Bearer JWT verification
│   │   ├── errorHandler.ts  # Global error handler
│   │   ├── requestId.ts     # X-Request-ID propagation
│   │   └── requestLogger.ts # Request metric logger
│   ├── types/       # Shared TypeScript types
│   ├── utils/       # Common helper utilities
│   └── validation/  # Zod validation helpers
└── server.ts        # Express & Apollo Server factory and starter
```

## Logging

Structured JSON logging is powered by **Pino**.
- High-performance, structured JSON output in production environments.
- Pretty-printed, human-readable log formatting during local development.
- Contextual request logging by attaching child loggers containing `requestId` to incoming Express requests.

## Validation

Type-safe schema validation is powered by **Zod**.
- **Environment Validation**: Validates all environment variables during application startup (`config/env.ts`) and fails fast if required configurations are missing or invalid.
- **Input & DTO Validation**: Reusable `validateInput` and `validateDTO` functions safely parse and validate data payloads against Zod schemas.

## Error Handling

A centralized class hierarchy is implemented for application errors:
- `AppError`: Base application error with HTTP status codes and operational flags.
- `ValidationError`: For payload or schema validation failures (400 Bad Request).
- `NotFoundError`: For missing resources (404 Not Found).
- `UnauthorizedError`: For authentication/authorization failures (401 Unauthorized).
- `InternalServerError`: For unhandled application errors (500 Internal Server Error).
- **GraphQL Error Formatting**: `formatGraphQLError` sanitizes error responses to prevent internal stack traces or database details from leaking to clients in production environments.

## Testing Infrastructure

Tests are organized into structured directories:

```
tests/
├── integration/
│   ├── auth/       # Authentication integration tests
│   └── health/     # Health check smoke tests
└── unit/
    └── auth/       # Unit tests for password hashing, tokens, and services
```
