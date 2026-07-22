import { useQuery } from '@apollo/client';
import { STATUS_QUERY } from '@/graphql/queries';

interface StatusData {
  status: string;
}

/**
 * Fetches the backend status string to verify API connectivity.
 * Returns { status, loading, error }.
 */
export const useStatus = () => {
  const { data, loading, error } = useQuery<StatusData>(STATUS_QUERY);
  return { status: data?.status ?? null, loading, error };
};
