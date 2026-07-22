import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser } from '@/types';

/* ─── Shape ─────────────────────────────────────────────────────── */
interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** Foundation only – full implementation comes in v1.2 */
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY  = 'streamhub_access_token';
const REFRESH_TOKEN_KEY = 'streamhub_refresh_token';

/* ─── Provider ──────────────────────────────────────────────────── */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(
    (token: string, refreshToken: string, authUser: AuthUser) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setAccessToken(token);
      setUser(authUser);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ─── Hook ──────────────────────────────────────────────────────── */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
