export const recommendationsTypeDefs = `#graphql
  type RecommendationResponse {
    items: [Content!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  extend type Query {
    similarContent(contentId: ID!, page: Int, limit: Int): RecommendationResponse!
    popularContent(page: Int, limit: Int): RecommendationResponse!
    trendingRecommendations(page: Int, limit: Int): RecommendationResponse!
    topRatedContent(page: Int, limit: Int, minimumReviews: Int): RecommendationResponse!
    continueDiscovering(page: Int, limit: Int): RecommendationResponse!
  }
`;
