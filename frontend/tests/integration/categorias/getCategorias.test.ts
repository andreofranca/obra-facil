import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/categorias/route';
import { NextRequest } from 'next/server';
import { CategoriaFactory } from '../factories/categoriaFactory';

describe('Integration - Categorias', () => {
  it('deve listar as categorias ordenadas por nome', async () => {
    // Given
    await CategoriaFactory.create({ nome: 'Zebra' });
    await CategoriaFactory.create({ nome: 'Abelha' });

    // When
    const res = await GET();
    const data = await res.json();

    // Then
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
    
    // Check sorting and structure
    const nomes = data.map((c: { nome: string }) => c.nome);
    expect(nomes.indexOf('Abelha')).toBeLessThan(nomes.indexOf('Zebra'));
    
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      nome: expect.any(String)
    });
  });

  // Since GET /categorias is just a simple findMany without parameters, 
  // there's no obvious negative scenario (like 404 or 400). We can simulate 
  // a negative scenario for an empty database, but the API just returns [] for that.
});
