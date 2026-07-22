import { gql } from '@apollo/client';

/** Returns the backend status string – used to verify connectivity */
export const STATUS_QUERY = gql`
  query Status {
    status
  }
`;
