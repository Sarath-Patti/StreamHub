import { describe, it, expect } from 'vitest';
import { AuthService } from '@/modules/auth/service/auth.service';

describe('JWT Token Generation & Verification Unit Tests', () => {
  const authService = new AuthService({} as any);

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    role: 'USER',
  };

  it('generates a valid access token', () => {
    const token = authService.generateAccessToken(mockUser);
    expect(token).toBeTypeOf('string');
    expect(token.length).toBeGreaterThan(10);
  });

  it('generates and verifies a valid refresh token', () => {
    const token = authService.generateRefreshToken(mockUser);
    const decoded = authService.verifyRefreshToken(token);

    expect(decoded.userId).toBe(mockUser.id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
  });
});
