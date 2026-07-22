import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import type { AuthUser, AuthPayload } from '@/types';
import { ME_QUERY, LOGOUT_MUTATION, REFRESH_TOKEN_MUTATION } from '@/graphql/auth';

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingSession: boolean;
  setAuthSession: (payload: AuthPayload) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'streamhub_access_token';
const REFRESH_TOKEN_KEY = 'streamhub_refresh_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  const saveTokens = (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    setAccessToken(access);
  };

  const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  };

  const setAuthSession = useCallback((payload: AuthPayload) => {
    saveTokens(payload.accessToken, payload.refreshToken);
    setUser(payload.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.mutate({ mutation: LOGOUT_MUTATION }).catch(() => {
        // Ignore logout network/backend error during logout
      });
    } finally {
      clearTokens();
      await client.clearStore().catch(() => {});
    }
  }, [client]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearTokens();
      return false;
    }
    try {
      const { data } = await client.mutate<{ refreshToken: AuthPayload }>({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
      });
      if (data?.refreshToken) {
        setAuthSession(data.refreshToken);
        return true;
      }
    } catch {
      clearTokens();
    }
    return false;
  }, [client, setAuthSession]);

  // Restore session on mount / page refresh
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setIsLoadingSession(false);
      return;
    }

    client
      .query<{ me: AuthUser }>({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        if (isMounted && data?.me) {
          setUser(data.me);
        }
      })
      .catch(async () => {
        // Access token might be expired, attempt refresh token
        const refreshed = await refreshSession();
        if (!refreshed && isMounted) {
          clearTokens();
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [client, refreshSession]);

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),
    isAdmin: user?.role === 'ADMIN',
    isLoadingSession,
    setAuthSession,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
