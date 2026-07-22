import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_HTTP_URL ?? 'http://localhost:4000/graphql';

/** Attach Authorization header if an access token exists in localStorage */
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('streamhub_access_token');
  if (token) {
    operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return forward(operation);
});

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query:      { fetchPolicy: 'cache-first' },
  },
});
