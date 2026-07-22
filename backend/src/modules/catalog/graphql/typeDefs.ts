export const catalogTypeDefs = `#graphql
  enum ContentType {
    MOVIE
    SERIES
  }

  type Genre {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Episode {
    id: ID!
    episodeNumber: Int!
    title: String!
    description: String
    duration: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Season {
    id: ID!
    seasonNumber: Int!
    title: String
    description: String
    episodes: [Episode!]!
    createdAt: String!
    updatedAt: String!
  }

  type Content {
    id: ID!
    title: String!
    description: String!
    type: ContentType!
    releaseYear: Int!
    duration: Int
    language: String!
    rating: Float
    posterUrl: String
    bannerUrl: String
    isTrending: Boolean!
    genres: [Genre!]!
    seasons: [Season!]
    createdAt: String!
    updatedAt: String!
  }

  type ContentConnection {
    items: [Content!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateContentInput {
    title: String!
    description: String!
    type: ContentType!
    releaseYear: Int!
    duration: Int
    language: String!
    rating: Float
    posterUrl: String
    bannerUrl: String
    isTrending: Boolean
    genreIds: [String!]
  }

  input UpdateContentInput {
    title: String
    description: String
    type: ContentType
    releaseYear: Int
    duration: Int
    language: String
    rating: Float
    posterUrl: String
    bannerUrl: String
    isTrending: Boolean
    genreIds: [String!]
  }

  extend type Query {
    content(id: ID!): Content
    contents(
      page: Int
      limit: Int
      type: ContentType
      genreId: String
      sortBy: String
      sortOrder: String
    ): ContentConnection!
    searchContent(query: String!, page: Int, limit: Int): ContentConnection!
    trendingContent(limit: Int): [Content!]!
    genres: [Genre!]!
  }

  extend type Mutation {
    createContent(input: CreateContentInput!): Content!
    updateContent(id: ID!, input: UpdateContentInput!): Content!
    deleteContent(id: ID!): Boolean!
  }
`;
