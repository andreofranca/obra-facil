/* eslint-disable */
import { PrismaClient, Profissional } from '@prisma/client';
import { UserFactory } from './userFactory';

const prisma = new PrismaClient();

export const ProfissionalFactory = {
  async create(overrides?: Partial<Profissional>) {
    const user = await UserFactory.create({ role: 'PROFESSIONAL' });
    
    return prisma.profissional.create({
      data: {
        userId: user.id,
        descricao: 'Profissional de Teste',
        experiencia: 5,
        ...(overrides as any),
      },
      include: {
        user: true,
      }
    });
  }
};

