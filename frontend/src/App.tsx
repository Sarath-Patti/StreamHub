import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/graphql/client';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ui';
import { RootLayout } from '@/layouts/RootLayout';
import Home from '@/pages/Home';

const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  </ApolloProvider>
);

export default App;
