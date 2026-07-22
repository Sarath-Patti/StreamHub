# StreamHub Watchlist Architecture

This document details the architecture, Prisma database schema, repository layer, service layer, GraphQL API, and usage examples for the Watchlist module introduced in milestone v0.5.

## Module Structure

The Watchlist module is located in `backend/src/modules/watchlist/`:

```
modules/
└── watchlist/
    ├── graphql/       # GraphQL typeDefs and resolvers for Watchlist
    ├── repository/    # Data persistence layer using Prisma ORM
    ├── service/       # Business logic (duplicate prevention, pagination, removal)
    ├── validation/    # Zod schemas for input validation
    ├── types/         # DTOs and TypeScript interfaces
    └── index.ts       # Module exports
```

## Prisma Schema

```prisma
model Watchlist {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  contentId String
  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, contentId])
}
```

### Unique Constraint
The `@@unique([userId, contentId])` compound index prevents a user from adding duplicate watchlist entries for the same piece of content.

## Repository Layer (`WatchlistRepository`)

- `add(userId: string, contentId: string)`: Inserts a new watchlist record including joined `Content` and `Genre` metadata.
- `remove(userId: string, contentId: string)`: Deletes an existing watchlist record for a specific user and content item.
- `exists(userId: string, contentId: string)`: Checks if a watchlist entry already exists.
- `findByUser(userId: string, options)`: Returns paginated watchlist entries ordered by `createdAt: desc`.
- `countByUser(userId: string)`: Returns total watchlist count for a user.

## Service Layer (`WatchlistService`)

- **`addToWatchlist`**: Validates `contentId`, verifies the content exists in the catalog repository, checks for duplicate additions, and creates the entry.
- **`removeFromWatchlist`**: Removes the entry or throws `NotFoundError` if absent.
- **`getUserWatchlist`**: Returns paginated watchlist entries.
- **`getWatchlistCount`**: Returns count of saved watchlist items.

## GraphQL API

### Queries
- `myWatchlist(page: Int, limit: Int): WatchlistConnection!` (Requires authentication)
- `watchlistCount: Int!` (Requires authentication)

### Mutations
- `addToWatchlist(contentId: ID!): WatchlistItem!` (Requires authentication)
- `removeFromWatchlist(contentId: ID!): Boolean!` (Requires authentication)

## Example GraphQL Operations

### Add Content to Watchlist
```graphql
mutation AddMovieToWatchlist {
  addToWatchlist(contentId: "content-uuid-123") {
    id
    createdAt
    content {
      id
      title
      type
    }
  }
}
```

### Query User Watchlist
```graphql
query GetMyWatchlist {
  myWatchlist(page: 1, limit: 10) {
    total
    page
    totalPages
    items {
      id
      createdAt
      content {
        id
        title
        type
        releaseYear
        posterUrl
      }
    }
  }
}
```
