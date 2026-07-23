import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/graphql/client';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary, Spinner } from '@/components/ui';
import { RootLayout } from '@/layouts/RootLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Lazy-loaded page components for route code-splitting
const Discover = lazy(() => import('@/pages/Discover'));
const ContentDetails = lazy(() => import('@/pages/ContentDetails'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionDetails = lazy(() => import('@/pages/CollectionDetails'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const SearchDashboard = lazy(() => import('@/pages/SearchDashboard'));

const PageFallback: React.FC = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
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
                  path="search"
                  element={
                    <ProtectedRoute>
                      <SearchDashboard />
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
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  </ApolloProvider>
);

export default App;
