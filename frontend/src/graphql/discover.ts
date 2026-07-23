import { gql } from '@apollo/client';

export const DISCOVER_CONTENT_FIELDS = gql`
  fragment DiscoverContentFields on Content {
    id
    title
    description
    type
    releaseYear
    duration
    language
    rating
    posterUrl
    bannerUrl
    isTrending
    genres {
      id
      name
    }
  }
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres {
      id
      name
    }
  }
`;

export const GET_TRENDING = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query GetTrending($limit: Int) {
    trending(limit: $limit) {
      ...DiscoverContentFields
    }
  }
`;

export const GET_RECENTLY_ADDED = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query GetRecentlyAdded($limit: Int) {
    recentlyAdded(limit: $limit) {
      ...DiscoverContentFields
    }
  }
`;

export const GET_POPULAR = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query GetPopular($input: SearchInput) {
    discover(input: $input) {
      results {
        ...DiscoverContentFields
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const DISCOVER_CONTENT = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query DiscoverContent($input: SearchInput) {
    discover(input: $input) {
      results {
        ...DiscoverContentFields
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;
