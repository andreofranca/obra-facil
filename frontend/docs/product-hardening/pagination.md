# Infraestrutura de Paginação

O projeto agora conta com paginação padronizada na API para contornar gargalos de performance e memory leak em tabelas grandes.

## Como Usar
Ao expor uma nova rota de API que devolva coleções do banco de dados, utilize a função \`paginate\`:

\`\`\`typescript
import { paginate, PaginationRequest } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  const paginationRequest = PaginationRequest.fromSearchParams(request.nextUrl.searchParams);
  
  const result = await paginate(prisma.minhaEntidade, paginationRequest, {
    where: { ativo: true }
  });

  return apiSuccess(result);
}
\`\`\`

A resposta seguirá o contrato \`PaginatedResult\`:
\`\`\`json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "pageSize": 10,
  "totalPages": 15,
  "hasNext": true,
  "hasPrevious": false
}
\`\`\`
