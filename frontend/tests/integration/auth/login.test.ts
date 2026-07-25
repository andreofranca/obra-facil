import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { UserFactory } from '../factories/userFactory';

describe('Integration - Login de Usuário', () => {
  it('deve autenticar o usuário e retornar a sessão', async () => {
    // Given
    const email = `login-${Date.now()}@example.com`;
    await UserFactory.create({ email });
    
    const payload = {
      email,
      password: 'password123',
    };
    
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // When
    const res = await POST(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(200);
    expect(data.user).toMatchObject({
      email,
      userId: expect.any(String),
      role: expect.any(String)
    });
    
    const cookies = res.headers.get('Set-Cookie');
    expect(cookies).toBeDefined();
    expect(cookies).toContain('session=');
  });

  it('deve retornar 401 para credenciais inválidas', async () => {
    // Given
    const email = `invalido-${Date.now()}@example.com`;
    await UserFactory.create({ email });
    
    const payload = {
      email,
      password: 'wrongpassword',
    };
    
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // When
    const res = await POST(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(401);
    expect(data).toMatchObject({
      error: expect.any(String)
    });
  });
});
