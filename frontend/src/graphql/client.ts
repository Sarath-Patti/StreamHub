import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpUrl = import.meta.env.VITE_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: httpUrl,
  }),
  cache: new InMemoryCache(),
});
