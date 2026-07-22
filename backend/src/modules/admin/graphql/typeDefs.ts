export const adminTypeDefs = `#graphql
  type AdminDashboardStats {
    totalUsers: Int!
    totalContent: Int!
    movies: Int!
    series: Int!
    reviews: Int!
    watchlists: Int!
    trendingItems: Int!
    topRatedItems: Int!
    newestContent: [Content!]!
  }

  extend type Query {
    adminDashboard: AdminDashboardStats!
    reportedReviews(page: Int, limit: Int): ReviewConnection!
    deletedContent(page: Int, limit: Int): ContentConnection!
    adminContent(page: Int, limit: Int, includeDeleted: Boolean): ContentConnection!
  }

  extend type Mutation {
    restoreContent(id: ID!): Content!
    bulkDeleteContent(ids: [ID!]!): Boolean!
    bulkRestoreContent(ids: [ID!]!): Boolean!
    hideReview(id: ID!): Review!
    restoreReview(id: ID!): Review!
    deleteReviewAdmin(id: ID!): Boolean!
  }
`;
