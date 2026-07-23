import { gql } from '@apollo/client';
import { DISCOVER_CONTENT_FIELDS } from './discover';

export const MY_WATCHLIST = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query MyWatchlist($page: Int, $limit: Int) {
    myWatchlist(page: $page, limit: $limit) {
      items {
        id
        userId
        contentId
        createdAt
        updatedAt
        content {
          ...DiscoverContentFields
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const ADD_TO_WATCHLIST = gql`
  ${DISCOVER_CONTENT_FIELDS}
  mutation AddToWatchlist($contentId: ID!) {
    addToWatchlist(contentId: $contentId) {
      id
      userId
      contentId
      createdAt
      updatedAt
      content {
        ...DiscoverContentFields
      }
    }
  }
`;

export const REMOVE_FROM_WATCHLIST = gql`
  mutation RemoveFromWatchlist($contentId: ID!) {
    removeFromWatchlist(contentId: $contentId)
  }
`;
