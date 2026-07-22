# StreamHub Reviews & Ratings Architecture

This document details the architecture, Prisma database schema, repository layer, service layer, GraphQL API, and usage examples for the Reviews & Ratings module introduced in milestone v0.6.

## Module Structure

The Reviews module is located in `backend/src/modules/reviews/`:

```
modules/
└── reviews/
    ├── graphql/       # GraphQL typeDefs and resolvers for Reviews
    ├── repository/    # Data persistence layer using Prisma ORM
    ├── service/       # Business logic (ratings, duplicate prevention, pagination)
    ├── validation/    # Zod schemas for input validation
    ├── types/         # DTOs and TypeScript interfaces
    └── index.ts       # Module exports
```

## Prisma Schema

```prisma
model Review {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  contentId String
  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  rating    Int
  review    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, contentId])
}
```

### Unique Constraint
The `@@unique([userId, contentId])` compound index guarantees that each user can write at most one review per content item.

## Repository Layer (`ReviewsRepository`)

- `create(data)`: Creates a review record joined with user details.
- `update(id, data)`: Updates rating/review text for a review record.
- `delete(id)`: Deletes a review record.
- `findById(id)`: Fetches a single review with user details.
- `findByContent(contentId, options)`: Returns paginated reviews for content, ordered by `newest` (`createdAt: desc`) or `highest` (`rating: desc`).
- `findByUser(userId, options)`: Returns paginated reviews created by a specific user.
- `exists(userId, contentId)`: Checks if a review already exists.
- `getAverageRating(contentId)`: Calculates floating point average rating rounded to 1 decimal place.
- `getRatingDistribution(contentId)`: Calculates count of reviews for each star level (1 to 5).

## Service Layer (`ReviewsService`)

- **`createReview`**: Validates `contentId`, `rating` (1-5), and review text length, checks catalog content existence, prevents duplicate reviews per user/content pair.
- **`updateReview`**: Validates input and verifies review ownership before applying updates.
- **`deleteReview`**: Verifies review ownership before deleting.
- **`getReviewsByContent`**: Returns paginated content reviews with sorting options (`newest` / `highest`).
- **`getUserReviews`**: Returns paginated user reviews.
- **`getAverageRating`**: Returns calculated average score.
- **`getRatingDistribution`**: Returns star rating breakdown object.

## GraphQL API

### Queries
- `reviewsByContent(contentId: ID!, page: Int, limit: Int, sortBy: String): ReviewConnection!`
- `myReviews(page: Int, limit: Int): UserReviewConnection!` (Requires authentication)
- `averageRating(contentId: ID!): Float!`
- `ratingDistribution(contentId: ID!): RatingDistribution!`

### Mutations
- `createReview(input: CreateReviewInput!): Review!` (Requires authentication)
- `updateReview(id: ID!, input: UpdateReviewInput!): Review!` (Requires authentication)
- `deleteReview(id: ID!): Boolean!` (Requires authentication)

## Example GraphQL Operations

### Create Review
```graphql
mutation AddReview {
  createReview(input: {
    contentId: "content-uuid-123"
    rating: 5
    review: "An absolute masterpiece!"
  }) {
    id
    rating
    review
    createdAt
  }
}
```

### Get Content Reviews and Ratings
```graphql
query GetMovieReviews {
  averageRating(contentId: "content-uuid-123")
  ratingDistribution(contentId: "content-uuid-123") {
    star5
    star4
    star3
    star2
    star1
  }
  reviewsByContent(contentId: "content-uuid-123", page: 1, limit: 10, sortBy: "highest") {
    total
    items {
      id
      rating
      review
      user {
        name
      }
    }
  }
}
```
