import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { ProfissionalResumo } from "@/types/profissional";

const prisma = new PrismaClient();

export type OrdenacaoProfissionais = "nome" | "nome_desc" | "avaliacao" | "recentes";

interface GetProfissionaisOptions {
  q?: string;
  categoria?: string;
  avaliacaoMinima?: number;
  premium?: boolean;
  disponibilidade?: boolean;
  cidade?: string;
  ordenacao?: OrdenacaoProfissionais;
  pagina?: number;
  limite?: number;
  revalidate?: number; // Permite sobrescrever o cache se necessário (ex: 0 para no-store)
}

const include = {
  user: true,
  avaliacoes: true,
  servicos: {
    include: {
      categoria: true,
    },
  },
};

export interface PaginatedResponse<T> {
  dados: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  possuiPaginaAnterior: boolean;
  possuiProximaPagina: boolean;
}

export async function getProfissionais(
  options: GetProfissionaisOptions = {}
): Promise<PaginatedResponse<ProfissionalResumo>> {
  const revalidate = options.revalidate ?? 60;
  
  // Se for force-dynamic/no-store, acessamos direto
  if (revalidate === 0) {
    return fetchProfissionaisFromDB(options);
  }

  // Senão, envelopamos no cache do Next.js
  const cacheKey = `profissionais-${JSON.stringify({ ...options, revalidate: undefined })}`;
  
  const cachedData = unstable_cache(
    async () => fetchProfissionaisFromDB(options),
    [cacheKey],
    {
      revalidate: revalidate,
      tags: ["profissionais"],
    }
  );

  return cachedData();
}

async function fetchProfissionaisFromDB(options: GetProfissionaisOptions): Promise<PaginatedResponse<ProfissionalResumo>> {
  const pagina = Math.max(1, options.pagina || 1);
  const limite = Math.min(Math.max(1, options.limite || 10), 100); // Mínimo 1, Padrão 10, Máximo Seguro 100
  const skip = (pagina - 1) * limite;
  
  const where: import("@prisma/client").Prisma.ProfissionalWhereInput = {};

  if (options.disponibilidade !== undefined) {
    where.ativo = options.disponibilidade;
  }

  if (options.categoria) {
    where.servicos = {
      some: {
        categoria: {
          nome: options.categoria,
        },
      },
    };
  }

  if (options.q) {
    const termoBusca: import("@prisma/client").Prisma.StringFilter = { contains: options.q, mode: "insensitive" };
    where.OR = [
      { user: { name: termoBusca } },
      { descricao: termoBusca },
      {
        servicos: {
          some: {
            OR: [
              { titulo: termoBusca },
              { categoria: { nome: termoBusca } }
            ]
          },
        },
      },
    ];
  }

  let orderBy: import("@prisma/client").Prisma.ProfissionalOrderByWithRelationInput = { user: { name: 'asc' } }; // Default
  if (options.ordenacao === 'nome_desc') {
    orderBy = { user: { name: 'desc' } };
  } else if (options.ordenacao === 'recentes') {
    orderBy = { user: { createdAt: 'desc' } };
  }

  let profissionais: ProfissionalResumo[] = [];
  let totalRegistros = 0;

  const needsMemoryProcessing = options.avaliacaoMinima !== undefined || options.ordenacao === 'avaliacao';

  if (needsMemoryProcessing) {
    // Trazemos todos os registros correspondentes ao WHERE e aplicamos ordenação e paginação em memória
    profissionais = await prisma.profissional.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include,
      orderBy
    });

    if (options.avaliacaoMinima !== undefined && options.avaliacaoMinima > 0) {
      profissionais = profissionais.filter(profissional => {
        if (!profissional.avaliacoes || profissional.avaliacoes.length === 0) return false;
        const soma = profissional.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
        const media = Math.round(soma / profissional.avaliacoes.length);
        return media >= options.avaliacaoMinima!;
      });
    }

    if (options.ordenacao === 'avaliacao') {
      profissionais.sort((a, b) => {
        const notaA = a.avaliacoes && a.avaliacoes.length > 0
          ? a.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / a.avaliacoes.length
          : 0;
        const notaB = b.avaliacoes && b.avaliacoes.length > 0
          ? b.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / b.avaliacoes.length
          : 0;
        return notaB - notaA;
      });
    }

    totalRegistros = profissionais.length;
    profissionais = profissionais.slice(skip, skip + limite);
  } else {
    // Paginação nativa e contagem via Prisma (Performance máxima)
    [totalRegistros, profissionais] = await Promise.all([
      prisma.profissional.count({ where: Object.keys(where).length > 0 ? where : undefined }),
      prisma.profissional.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        include,
        orderBy,
        skip,
        take: limite
      })
    ]);
  }

  const totalPaginas = Math.ceil(totalRegistros / limite);

  return {
    dados: profissionais,
    paginaAtual: pagina,
    totalPaginas,
    totalRegistros,
    limite,
    possuiPaginaAnterior: pagina > 1,
    possuiProximaPagina: pagina < totalPaginas
  };
}
