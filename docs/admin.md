# StreamHub Platform Administration Architecture

This document details the architecture, Role-Based Access Control (RBAC), content administration (soft delete & bulk operations), moderation workflows, analytics, and GraphQL API for the Platform Administration module introduced in milestone v0.9.

## Module Structure

The Admin module is located in `backend/src/modules/admin/`:

```
modules/
└── admin/
    ├── graphql/       # GraphQL typeDefs and resolvers protected by RBAC
    ├── repository/    # Data persistence for admin actions, dashboard metrics & moderation
    ├── service/       # Business logic (RBAC checks, soft delete lifecycle, bulk operations)
    ├── validation/    # Zod schemas for admin parameters
    ├── types/         # DTOs and TypeScript interfaces
    └── index.ts       # Module exports
```

## Role-Based Access Control (RBAC)

- Roles: `USER` and `ADMIN`.
- Authorization: All administrative queries and mutations validate `context.user?.role === 'ADMIN'`. Non-admin or unauthenticated access attempts result in `UnauthorizedError('Admin access required')`.

## Content Lifecycle & Soft Delete

- **Soft Delete**: Sets `isDeleted: true` and records `deletedAt: DateTime`.
- **Restore**: Clears `isDeleted: false` and sets `deletedAt: null`.
- **Bulk Operations**: Perform batch soft deletion (`bulkDeleteContent`) and batch restoration (`bulkRestoreContent`) over arrays of content IDs.

## Moderation & Analytics

- **Review Moderation**: `hideReview` sets `isHidden: true`, `restoreReview` clears flags, and `deleteReviewAdmin` performs administrative removal.
- **Dashboard Analytics (`adminDashboard`)**:
  - `totalUsers`: Total registered users
  - `totalContent`: Active non-deleted content count
  - `movies` / `series`: Content type breakdowns
  - `reviews` / `watchlists`: Platform engagement totals
  - `trendingItems` / `topRatedItems`: Discovery metrics
  - `newestContent`: Recent catalog entries

## GraphQL API

### Queries (ADMIN Only)
- `adminDashboard: AdminDashboardStats!`
- `reportedReviews(page: Int, limit: Int): ReviewConnection!`
- `deletedContent(page: Int, limit: Int): ContentConnection!`
- `adminContent(page: Int, limit: Int, includeDeleted: Boolean): ContentConnection!`

### Mutations (ADMIN Only)
- `createContent(input: CreateContentInput!): Content!`
- `updateContent(id: ID!, input: UpdateContentInput!): Content!`
- `deleteContent(id: ID!): Boolean!`
- `restoreContent(id: ID!): Content!`
- `bulkDeleteContent(ids: [ID!]!): Boolean!`
- `bulkRestoreContent(ids: [ID!]!): Boolean!`
- `hideReview(id: ID!): Review!`
- `restoreReview(id: ID!): Review!`
- `deleteReviewAdmin(id: ID!): Boolean!`

## Example GraphQL Operations

### Fetch Admin Analytics Dashboard
```graphql
query GetAdminDashboard {
  adminDashboard {
    totalUsers
    totalContent
    movies
    series
    reviews
    watchlists
    trendingItems
    topRatedItems
  }
}
```

### Bulk Soft Delete Content
```graphql
mutation BulkDeleteMovies {
  bulkDeleteContent(ids: ["content-uuid-1", "content-uuid-2"])
}
```
