export const reviewsTypeDefs = `#graphql
  type ReviewUser {
    id: ID!
    name: String!
  }

  type Review {
    id: ID!
    userId: String!
    contentId: String!
    user: ReviewUser!
    rating: Int!
    review: String
    createdAt: String!
    updatedAt: String!
  }

  type UserReview {
    id: ID!
    userId: String!
    contentId: String!
    content: Content!
    rating: Int!
    review: String
    createdAt: String!
    updatedAt: String!
  }

  type ReviewConnection {
    items: [Review!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type UserReviewConnection {
    items: [UserReview!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type RatingDistribution {
    star1: Int!
    star2: Int!
    star3: Int!
    star4: Int!
    star5: Int!
  }

  input CreateReviewInput {
    contentId: ID!
    rating: Int!
    review: String
  }

  input UpdateReviewInput {
    rating: Int
    review: String
  }

  extend type Query {
    reviewsByContent(
      contentId: ID!
      page: Int
      limit: Int
      sortBy: String
    ): ReviewConnection!
    myReviews(page: Int, limit: Int): UserReviewConnection!
    averageRating(contentId: ID!): Float!
    ratingDistribution(contentId: ID!): RatingDistribution!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;
