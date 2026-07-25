import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { UserFactory } from '../factories/userFactory';

const prisma = new PrismaClient();

describe('Integration - Buscar Usuário', () => {
  it('deve consultar os dados corretos de um usuário existente', async () => {
    // Given
    const user = await UserFactory.create({ name: 'Busca Teste' });

    // When
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Then
    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBe(user.id);
    expect(foundUser?.name).toBe('Busca Teste');
    expect(foundUser?.email).toBe(user.email);
  });
});
