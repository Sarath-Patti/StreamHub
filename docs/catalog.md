# StreamHub Content Catalog Architecture

This document details the architecture, database models, repository methods, service layer, GraphQL API, and seed script for the Content Catalog module introduced in milestone v0.4.

## Module Structure

The Content Catalog module is located in `backend/src/modules/catalog/`:

```
modules/
└── catalog/
    ├── graphql/       # GraphQL schema (typeDefs) and resolvers for catalog
    ├── repository/    # Data persistence layer using Prisma ORM
    ├── service/       # Business logic (filtering, search, pagination, trending)
    ├── validation/    # Zod validation schemas for content inputs
    ├── types/         # Catalog DTOs and TypeScript interfaces
    └── index.ts       # Public module exports
```

## Prisma Schema

```prisma
enum ContentType {
  MOVIE
  SERIES
}

model Content {
  id          String      @id @default(uuid())
  title       String
  description String
  type        ContentType
  releaseYear Int
  duration    Int?
  language    String
  rating      Float?
  posterUrl   String?
  bannerUrl   String?
  isTrending  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  genres      Genre[]     @relation("ContentGenres")
  seasons     Season[]
}

model Genre {
  id        String    @id @default(uuid())
  name      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  contents  Content[] @relation("ContentGenres")
}

model Season {
  id           String    @id @default(uuid())
  seasonNumber Int
  title        String?
  description  String?
  contentId    String
  content      Content   @relation(fields: [contentId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  episodes     Episode[]
}

model Episode {
  id            String   @id @default(uuid())
  episodeNumber Int
  title         String
  description   String?
  duration      Int
  seasonId      String
  season        Season   @relation(fields: [seasonId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Repository Layer (`CatalogRepository`)

- `findById(id: string)`: Retrieves content entity with associated genres and season/episode hierarchy.
- `findAll(options)`: Supports paginated querying, filtering by `type` and `genreId`, and sorting.
- `search(query, options)`: Performs case-insensitive title and description search.
- `findTrending(limit)`: Retrieves top-rated content items marked as `isTrending`.
- `findByGenre(genreId, options)`: Retrieves content belonging to a specific genre.
- `findAllGenres()`: Lists all catalog genres sorted by name.
- `create(data)` / `update(id, data)` / `delete(id)`: Content mutation procedures.

## GraphQL Operations

### Queries
- `content(id: ID!): Content`
- `contents(page: Int, limit: Int, type: ContentType, genreId: String, sortBy: String, sortOrder: String): ContentConnection!`
- `searchContent(query: String!, page: Int, limit: Int): ContentConnection!`
- `trendingContent(limit: Int): [Content!]!`
- `genres: [Genre!]!`

### Mutations
- `createContent(input: CreateContentInput!): Content!`
- `updateContent(id: ID!, input: UpdateContentInput!): Content!`
- `deleteContent(id: ID!): Boolean!`

## Example GraphQL Queries

### Search Content
```graphql
query SearchMovies {
  searchContent(query: "Inception", page: 1, limit: 10) {
    total
    page
    totalPages
    items {
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

### Create Content Mutation
```graphql
mutation AddMovie {
  createContent(input: {
    title: "The Dark Knight"
    description: "Batman raises the stakes in his war on crime."
    type: MOVIE
    releaseYear: 2008
    duration: 152
    language: "English"
    rating: 9.0
    isTrending: true
  }) {
    id
    title
    createdAt
  }
}
```

## Seed Script

Populate sample catalog data using Prisma:

```bash
npx prisma db seed
```
