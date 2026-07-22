# StreamHub Authentication Architecture

This document details the authentication architecture, token lifecycle, request authentication pipeline, and module organization introduced in milestone v0.3.

## Architectural Model & Modular Pattern

The authentication system is encapsulated in `backend/src/modules/auth/` and serves as the template pattern for all future feature modules:

```
modules/
└── auth/
    ├── graphql/       # GraphQL schema (typeDefs) and resolver map
    ├── repository/    # Data persistence layer using Prisma ORM
    ├── service/       # Business rules, bcrypt hashing, JWT issuance & verification
    ├── validation/    # Zod schemas for input validation
    ├── types/         # TypeScript DTOs and interfaces
    └── index.ts       # Public module exports
```

## JWT Token Lifecycle

1. **Token Specifications**:
   - **Access Token**: Short-lived JWT containing `userId`, `email`, and `role`. Signed using `JWT_SECRET`. Configured via `JWT_EXPIRES_IN` (default `15m`).
   - **Refresh Token**: Long-lived JWT signed using `JWT_REFRESH_SECRET`. Configured via `JWT_REFRESH_EXPIRES_IN` (default `7d`). Used to acquire new Access/Refresh token pairs.

2. **Authentication Operations**:
   - **Register (`register`)**: Hashes plain-text passwords via `bcryptjs`, creates `User` record in PostgreSQL, and returns `AuthPayload` (`accessToken`, `refreshToken`, sanitized `user`).
   - **Login (`login`)**: Verifies email existence and password hash match, returning a fresh `AuthPayload`.
   - **Refresh Token (`refreshToken`)**: Validates the refresh token signature and issues a new pair of access and refresh tokens.
   - **Current User (`me`)**: Protected GraphQL query returning the authenticated user profile.
   - **Logout (`logout`)**: Client-side token invalidation mutation.

## Request Authentication Pipeline

```
HTTP Request -> requestIdMiddleware -> requestLoggerMiddleware -> authMiddleware -> Express / Apollo Server -> GraphQL Context -> Resolvers -> AuthService -> AuthRepository -> Database
```

1. **`authMiddleware`**: Extracts `Authorization: Bearer <accessToken>` header, verifies the token using `JWT_SECRET`, and populates `req.user` (`{ id, email, role }`). If token is absent or invalid, `req.user` remains `null`.
2. **`createContext`**: Populates `GraphQLContext.user` directly from `req.user`.
3. **Protected Resolvers**: Check `context.user` and throw `UnauthorizedError` if unauthenticated.

## GraphQL Schema & Operations

```graphql
enum Role {
  USER
  ADMIN
}

type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  createdAt: String!
  updatedAt: String!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

input RegisterInput {
  name: String!
  email: String!
  password: String!
}

input LoginInput {
  email: String!
  password: String!
}

type Query {
  me: User
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(refreshToken: String!): AuthPayload!
  logout: Boolean!
}
```
