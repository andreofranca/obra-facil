import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/profissionais/route';
import { NextRequest } from 'next/server';
import { ProfissionalFactory } from '../factories/profissionalFactory';

describe('Integration - Profissionais', () => {
  it('deve listar profissionais retornando a estrutura correta', async () => {
    // Given
    await ProfissionalFactory.create();
    
    const req = new NextRequest('http://localhost/api/profissionais', {
      method: 'GET',
    });

    // When
    const res = await GET(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
    
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      userId: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String)
      })
    });
  });

  it('deve retornar 404 ao buscar por um ID inexistente (cenário negativo)', async () => {
    // Given
    const req = new NextRequest('http://localhost/api/profissionais?id=inexistente-123', {
      method: 'GET',
    });

    // When
    const res = await GET(req);
    const data = await res.json();

    // Then
    expect(res.status).toBe(404);
    expect(data).toMatchObject({
      error: expect.any(String)
    });
  });
});
