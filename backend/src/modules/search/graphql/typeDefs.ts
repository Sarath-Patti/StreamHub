export const searchTypeDefs = `#graphql
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

  extend type Query {
    search(input: SearchInput): SearchResponse!
    discover(input: SearchInput): SearchResponse!
    trending(limit: Int): [Content!]!
    recentlyAdded(limit: Int): [Content!]!
  }
`;
