import { describe, it, expect } from 'vitest';
import { AuthService } from '@/modules/auth/service/auth.service';

describe('Password Utilities Unit Tests', () => {
  const authService = new AuthService({} as any);

  it('hashes password and verifies successfully', async () => {
    const rawPassword = 'Password123!';
    const hash = await authService.hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    const match = await authService.comparePassword(rawPassword, hash);
    expect(match).toBe(true);
  });

  it('fails verification for incorrect password', async () => {
    const rawPassword = 'Password123!';
    const hash = await authService.hashPassword(rawPassword);

    const match = await authService.comparePassword('WrongPassword', hash);
    expect(match).toBe(false);
  });
});
