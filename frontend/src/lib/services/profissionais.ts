import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { ProfissionalResumo } from "@/types/profissional";

const prisma = new PrismaClient();

interface GetProfissionaisOptions {
  q?: string;
  categoria?: string;
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

export async function getProfissionais(
  options: GetProfissionaisOptions = {}
): Promise<ProfissionalResumo[]> {
  const revalidate = options.revalidate ?? 60;
  
  // Se for force-dynamic/no-store, acessamos direto
  if (revalidate === 0) {
    return fetchProfissionaisFromDB(options);
  }

  // Senão, envelopamos no cache do Next.js
  const cachedData = unstable_cache(
    async () => fetchProfissionaisFromDB(options),
    [`profissionais-${options.q || "all"}-${options.categoria || "all"}`],
    {
      revalidate: revalidate,
      tags: ["profissionais"],
    }
  );

  return cachedData();
}

async function fetchProfissionaisFromDB(options: GetProfissionaisOptions): Promise<ProfissionalResumo[]> {
  const where: import("@prisma/client").Prisma.ProfissionalWhereInput = {};

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
            titulo: termoBusca,
          },
        },
      },
    ];
  }

  const profissionais = await prisma.profissional.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include,
    orderBy: {
      user: { name: 'asc' }
    }
  });

  return profissionais;
}
