import { PrismaClient, UserRole, User } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export const UserFactory = {
  async create(overrides?: Partial<User>) {
    const defaultPassword = await hashPassword('password123');
    return prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: defaultPassword,
        role: UserRole.CLIENT,
        ...overrides,
      },
    });
  }
};
