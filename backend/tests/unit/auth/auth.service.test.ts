import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '@/modules/auth/service/auth.service';
import { AuthRepository } from '@/modules/auth/repository/auth.repository';
import { ValidationError, UnauthorizedError } from '@/shared/errors';

describe('AuthService Logic Unit Tests', () => {
  const mockRepo = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    createUser: vi.fn(),
  } as unknown as AuthRepository;

  const authService = new AuthService(mockRepo);

  it('throws ValidationError when registering with duplicate email', async () => {
    vi.spyOn(mockRepo, 'findByEmail').mockResolvedValueOnce({
      id: 'existing-id',
      name: 'Existing User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      authService.register({
        name: 'New User',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('throws UnauthorizedError when logging in with wrong password', async () => {
    const hashedPassword = await authService.hashPassword('correctPassword');
    vi.spyOn(mockRepo, 'findByEmail').mockResolvedValueOnce({
      id: 'user-id',
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      authService.login({
        email: 'user@example.com',
        password: 'wrongPassword',
      })
    ).rejects.toThrow(UnauthorizedError);
  });
});
