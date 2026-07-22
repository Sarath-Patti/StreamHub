export const watchlistTypeDefs = `#graphql
  type WatchlistItem {
    id: ID!
    userId: String!
    contentId: String!
    content: Content!
    createdAt: String!
    updatedAt: String!
  }

  type WatchlistConnection {
    items: [WatchlistItem!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  extend type Query {
    myWatchlist(page: Int, limit: Int): WatchlistConnection!
    watchlistCount: Int!
  }

  extend type Mutation {
    addToWatchlist(contentId: ID!): WatchlistItem!
    removeFromWatchlist(contentId: ID!): Boolean!
  }
`;
