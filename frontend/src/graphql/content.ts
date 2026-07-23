import { gql } from '@apollo/client';
import { DISCOVER_CONTENT_FIELDS } from './discover';

export const GET_CONTENT_BY_ID = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query GetContentById($id: ID!) {
    content(id: $id) {
      ...DiscoverContentFields
    }
  }
`;

export const GET_SIMILAR_CONTENT = gql`
  ${DISCOVER_CONTENT_FIELDS}
  query GetSimilarContent($contentId: ID!, $limit: Int) {
    similarContent(contentId: $contentId, limit: $limit) {
      items {
        ...DiscoverContentFields
      }
      totalCount
    }
  }
`;
