import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integration - Criar Usuário', () => {
  it('deve registrar um novo usuário com sucesso e persistir no banco', async () => {
    // Given
    const email = `novo-${Date.now()}@example.com`;
    const payload = {
      name: 'Novo Usuário',
      email,
      password: 'password123',
    };
    
    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // When
    const res = await POST(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(201);
    expect(data.user).toMatchObject({
      email,
      name: 'Novo Usuário',
      userId: expect.any(String),
      role: expect.any(String)
    });

    // Validate persistence
    const savedUser = await prisma.user.findUnique({
      where: { email },
    });
    
    expect(savedUser).not.toBeNull();
    expect(savedUser?.name).toBe('Novo Usuário');
  });

  it('deve retornar 400 se a senha for muito curta', async () => {
    // Given
    const payload = {
      name: 'Novo Usuário',
      email: `curta-${Date.now()}@example.com`,
      password: '123', // < 6 caracteres
    };
    
    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // When
    const res = await POST(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(400);
    expect(data).toMatchObject({
      error: expect.any(String)
    });
  });

  it('deve retornar 409 se o email já estiver cadastrado', async () => {
    // Given
    const email = `duplicado-${Date.now()}@example.com`;
    const payload = { name: 'Usuário 1', email, password: 'password123' };
    
    const req1 = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await POST(req1); // Cadastra o primeiro
    
    const req2 = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // When
    const res = await POST(req2);
    const data = await res.json();

    // Then
    expect(res.status).toBe(409);
    expect(data).toMatchObject({
      error: expect.any(String)
    });
  });
});
