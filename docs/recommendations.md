# StreamHub Recommendation Engine Architecture

This document details the architecture, deterministic ranking algorithms, service/repository layers, GraphQL API, and usage examples for the Recommendation Engine module introduced in milestone v0.8.

## Module Structure

The Recommendations module is located in `backend/src/modules/recommendations/`:

```
modules/
└── recommendations/
    ├── graphql/       # GraphQL typeDefs and resolvers
    ├── repository/    # Data persistence and deterministic scoring queries
    ├── service/       # Business logic (strategy execution, pagination, metadata)
    ├── validation/    # Zod schemas for query parameters
    ├── types/         # DTOs and TypeScript interfaces
    └── index.ts       # Module exports
```

## Recommendation Strategies & Ranking Algorithms

The Recommendation Engine implements five deterministic scoring algorithms without third-party ML dependencies:

### 1. Similar Content (`similarContent`)
- **Scoring**:
  - Shared Genres: +3 points per matching genre
  - Same Content Type (`MOVIE` vs `SERIES`): +2 points
  - Release Year Proximity (within ±5 years): +1 point
  - Rating Proximity (within ±1.5 rating points): +1 point
- Excludes the reference `contentId` itself.

### 2. Popular Content (`popularContent`)
- **Scoring**: `PopularityScore = (ReviewCount * 2.0) + (WatchlistCount * 1.5) + (Rating * 3.0)`

### 3. Trending Content (`trendingRecommendations`)
- **Scoring**: `TrendingScore = (RecentReviews30d * 3.0) + (RecentWatchlists30d * 2.0) + RecencyBonus + IsTrendingBonus`

### 4. Top Rated Content (`topRatedContent`)
- Filters content having at least `minimumReviews` (default 0) and sorts by `rating: desc`.

### 5. Continue Discovering (`continueDiscovering`)
- Excludes items already reviewed or watchlisted by the user.
- Scores candidates based on user genre affinity (genres from user's watchlist/reviews) plus base item rating.

## Repository Layer (`RecommendationsRepository`)

- `getSimilarContent(contentId, options)`
- `getPopularContent(options)`
- `getTrendingContent(options)`
- `getTopRatedContent(options)`
- `getContinueDiscovering(userId, options)`

## Service Layer (`RecommendationsService`)

- **`getSimilarContent`**: Verifies catalog content existence, executes scoring via repository, and returns paginated `RecommendationResponseDTO`.
- **`getPopularContent`**: Returns popular content items.
- **`getTrendingContent`**: Returns trending content items.
- **`getTopRatedContent`**: Returns top-rated items with minimum review threshold filtering.
- **`getContinueDiscovering`**: Returns personalized un-interacted content for authenticated user.

## GraphQL API

### Queries
- `similarContent(contentId: ID!, page: Int, limit: Int): RecommendationResponse!`
- `popularContent(page: Int, limit: Int): RecommendationResponse!`
- `trendingRecommendations(page: Int, limit: Int): RecommendationResponse!`
- `topRatedContent(page: Int, limit: Int, minimumReviews: Int): RecommendationResponse!`
- `continueDiscovering(page: Int, limit: Int): RecommendationResponse!` (Requires authentication)

### Types
```graphql
type RecommendationResponse {
  items: [Content!]!
  totalCount: Int!
  totalPages: Int!
  currentPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

## Example GraphQL Operations

### Get Similar Movies
```graphql
query GetSimilarToInception {
  similarContent(contentId: "content-uuid-123", page: 1, limit: 5) {
    totalCount
    items {
      id
      title
      rating
      releaseYear
    }
  }
}
```

### Continue Discovering for Authenticated User
```graphql
query PersonalizedDiscovery {
  continueDiscovering(page: 1, limit: 10) {
    totalCount
    currentPage
    hasNextPage
    items {
      id
      title
      type
      rating
      genres {
        name
      }
    }
  }
}
```
