import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LOGIN_MUTATION } from '@/graphql/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input, Button, Badge } from '@/components/ui';
import type { AuthPayload } from '@/types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [loginMutation, { loading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email: email.trim(),
            password,
          },
        },
      });

      if (data?.login) {
        setSuccessMessage('Login successful! Redirecting...');
        setAuthSession(data.login);

        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setErrors({ general: msg });
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your StreamHub account to continue"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {errors.general && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-400 font-medium leading-relaxed">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="flex items-center justify-center p-3">
            <Badge variant="success" className="px-4 py-1.5 text-xs">
              {successMessage}
            </Badge>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
          autoComplete="current-password"
          required
        />

        <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
