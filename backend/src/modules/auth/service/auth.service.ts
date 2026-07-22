import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { AuthRepository, authRepository as defaultAuthRepo } from '../repository/auth.repository';
import { RegisterInputDTO, LoginInputDTO, AuthPayloadDTO, UserDTO } from '../types';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { ValidationError, UnauthorizedError } from '@/shared/errors';
import { User } from '@prisma/client';

export class AuthService {
  constructor(private repo: AuthRepository = defaultAuthRepo) {}

  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generateAccessToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );
  }

  public generateRefreshToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn as any }
    );
  }

  public verifyRefreshToken(token: string): { userId: string; email: string; role: string } {
    try {
      return jwt.verify(token, config.jwtRefreshSecret) as { userId: string; email: string; role: string };
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  public formatUser(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public async register(input: RegisterInputDTO): Promise<AuthPayloadDTO> {
    const validated = validateInput(registerSchema, input);
    const existing = await this.repo.findByEmail(validated.email);
    if (existing) {
      throw new ValidationError('Email already in use');
    }

    const passwordHash = await this.hashPassword(validated.password);
    const user = await this.repo.createUser({
      name: validated.name,
      email: validated.email,
      passwordHash,
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: this.formatUser(user),
    };
  }

  public async login(input: LoginInputDTO): Promise<AuthPayloadDTO> {
    const validated = validateInput(loginSchema, input);
    const user = await this.repo.findByEmail(validated.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await this.comparePassword(validated.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: this.formatUser(user),
    };
  }

  public async refreshToken(refreshToken: string): Promise<AuthPayloadDTO> {
    validateInput(refreshTokenSchema, { refreshToken });
    const decoded = this.verifyRefreshToken(refreshToken);
    const user = await this.repo.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: this.formatUser(user),
    };
  }

  public async getCurrentUser(userId: string): Promise<UserDTO> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return this.formatUser(user);
  }
}

export const authService = new AuthService();
