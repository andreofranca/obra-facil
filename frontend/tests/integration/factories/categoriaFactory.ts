import { PrismaClient, CategoriaServico } from '@prisma/client';

const prisma = new PrismaClient();

export const CategoriaFactory = {
  async create(overrides?: Partial<CategoriaServico>) {
    return prisma.categoriaServico.create({
      data: {
        nome: `Categoria ${Date.now()}`,
        ...overrides,
      },
    });
  }
};
