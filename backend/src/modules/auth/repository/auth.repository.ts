import { prisma } from '@/config/prisma';
import { User, Role } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: { name: string; email: string; passwordHash: string; role?: Role }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.passwordHash,
        role: data.role || Role.USER,
      },
    });
  }
}

export const authRepository = new AuthRepository();
