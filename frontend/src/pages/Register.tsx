import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { REGISTER_MUTATION } from '@/graphql/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input, Button, Badge } from '@/components/ui';
import type { AuthPayload } from '@/types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [registerMutation, { loading }] = useMutation<{ register: AuthPayload }>(REGISTER_MUTATION);

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

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

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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
      const { data } = await registerMutation({
        variables: {
          input: {
            name: name.trim(),
            email: email.trim(),
            password,
          },
        },
      });

      if (data?.register) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setAuthSession(data.register);

        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrors({ general: msg });
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join StreamHub today to stream unlimited content"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
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
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
          required
        />

        <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
};

export default Register;
