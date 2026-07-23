import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/graphql/client';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ui';
import { RootLayout } from '@/layouts/RootLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Discover from '@/pages/Discover';
import ContentDetails from '@/pages/ContentDetails';
import Collections from '@/pages/Collections';
import CollectionDetails from '@/pages/CollectionDetails';
import Analytics from '@/pages/Analytics';

const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route
                path="discover"
                element={
                  <ProtectedRoute>
                    <Discover />
                  </ProtectedRoute>
                }
              />
              <Route
                path="content/:id"
                element={
                  <ProtectedRoute>
                    <ContentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="collections"
                element={
                  <ProtectedRoute>
                    <Collections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="collections/:id"
                element={
                  <ProtectedRoute>
                    <CollectionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  </ApolloProvider>
);

export default App;
