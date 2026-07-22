# StreamHub Engineering Foundation

This document details the engineering principles, infrastructure, and standards established in milestone v0.2.

## Folder Structure

The repository organizes core features and shared infrastructure into distinct modules:

```
streamhub/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration & validation
│   │   ├── graphql/         # GraphQL schema, resolvers, and context
│   │   │   ├── context/     # Request-scoped context factory
│   │   │   ├── resolvers/   # Query and mutation resolvers
│   │   │   └── schema/      # Type definitions
│   │   ├── routes/          # Express route handlers (e.g., health)
│   │   ├── shared/          # Reusable shared infrastructure
│   │   │   ├── constants/   # System-wide constants
│   │   │   ├── errors/      # Application error hierarchy & formatters
│   │   │   ├── logger/      # Pino logger configuration
│   │   │   ├── middleware/  # Express middlewares
│   │   │   ├── types/       # Shared TypeScript types
│   │   │   ├── utils/       # Utility functions
│   │   │   └── validation/  # Zod validation helpers
│   │   └── index.ts         # Application entry point
│   ├── tests/
│   │   ├── unit/            # Unit tests
│   │   └── integration/     # Integration & smoke tests
│   └── vitest.config.ts     # Vitest test runner configuration
├── frontend/                # React 19 + Vite frontend
├── shared/                  # Root-level shared utilities
├── docs/                    # Architectural & engineering documentation
├── docker/                  # Docker container configs
└── docker-compose.yml       # Multi-container orchestration
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

## Request Lifecycle

Express middleware manages HTTP request lifecycle in a structured pipeline:
1. **Request ID Middleware**: Generates or propagates `X-Request-ID` headers and attaches child logger instances to `req`.
2. **Request Logger Middleware**: Tracks HTTP request completion metrics (method, URL, status code, duration).
3. **Auth Placeholder Middleware**: Prepares request context for future authentication without executing auth logic.
4. **Global Error Handler Middleware**: Catches unhandled errors and formats clean, standardized JSON error responses.

## GraphQL Organization

GraphQL infrastructure is organized into dedicated submodules:
- `graphql/schema/`: Schema type definitions (`typeDefs`).
- `graphql/resolvers/`: Query and field resolution logic.
- `graphql/context/`: Context factory generating request-scoped context (`GraphQLContext`).
