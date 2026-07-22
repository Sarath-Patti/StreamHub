# StreamHub Search & Discovery Architecture

This document details the architecture, filtering options, service layer, repository layer, GraphQL API, and usage examples for the Search & Discovery module introduced in milestone v0.7.

## Module Structure

The Search module is located in `backend/src/modules/search/`:

```
modules/
└── search/
    ├── graphql/       # GraphQL typeDefs and resolvers for Search & Discovery
    ├── repository/    # Data persistence layer using Prisma ORM
    ├── service/       # Business logic (advanced filtering, sorting, pagination metadata)
    ├── validation/    # Zod schemas for SearchInput
    ├── types/         # DTOs and TypeScript interfaces
    └── index.ts       # Module exports
```

## Search Architecture

The module leverages Prisma ORM querying against the existing `Content` and `Genre` models:
- **Title and Description Search**: Case-insensitive partial text matching (`contains` with `mode: 'insensitive'`).
- **Filtering**: Type (`MOVIE`/`SERIES`), Genre (ID or name), Release Year, Language, and Minimum Rating threshold.
- **Sorting**: Flexible ordering by `releaseYear`, `rating`, `title`, or `createdAt` in `asc` or `desc` directions.
- **Pagination Metadata**: Computes `totalCount`, `totalPages`, `currentPage`, `hasNextPage`, and `hasPreviousPage`.

## Repository Layer (`SearchRepository`)

- `advancedSearch(options)`: Core query engine translating `SearchInputDTO` options into Prisma `where` clauses and returning items with joined genres plus total count.
- `filterByGenre(genre, options)`: Helper for genre-based queries.
- `filterByType(type, options)`: Helper for content type filtering.
- `filterByLanguage(language, options)`: Helper for language filtering.
- `filterByReleaseYear(year, options)`: Helper for release year filtering.
- `getTrending(limit)`: Retrieves items marked `isTrending: true` sorted by rating.
- `getRecentlyAdded(limit)`: Retrieves newest items sorted by `createdAt: desc`.

## Service Layer (`SearchService`)

- **`search(input)` / `discover(input)`**: Validates `SearchInput` via Zod (`searchInputSchema`), executes search queries via `SearchRepository`, formats results into `ContentDTO[]`, and returns comprehensive pagination metadata.
- **`getTrending(limit)`**: Retrieves trending content.
- **`getRecentlyAdded(limit)`**: Retrieves recently added content.

## GraphQL API

### Queries
- `search(input: SearchInput): SearchResponse!`
- `discover(input: SearchInput): SearchResponse!`
- `trending(limit: Int): [Content!]!`
- `recentlyAdded(limit: Int): [Content!]!`

### Types
```graphql
input SearchInput {
  query: String
  genre: String
  type: ContentType
  language: String
  releaseYear: Int
  minimumRating: Float
  page: Int
  limit: Int
  sortBy: String
  sortOrder: String
}

type SearchResponse {
  results: [Content!]!
  totalCount: Int!
  totalPages: Int!
  currentPage: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

## Example GraphQL Operations

### Advanced Content Discovery Query
```graphql
query DiscoverSciFiMovies {
  discover(input: {
    query: "Inception"
    type: MOVIE
    genre: "Sci-Fi"
    minimumRating: 8.0
    sortBy: "rating"
    sortOrder: "desc"
    page: 1
    limit: 10
  }) {
    totalCount
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
    results {
      id
      title
      releaseYear
      rating
      genres {
        name
      }
    }
  }
}
```

### Trending Content Discovery
```graphql
query GetTrendingMovies {
  trending(limit: 5) {
    id
    title
    rating
    posterUrl
  }
}
```
