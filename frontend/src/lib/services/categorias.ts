import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { CategoriaServico } from "@prisma/client";

const prisma = new PrismaClient();

// Acesso direto ao banco de dados pela camada de serviço (Padrão Next.js App Router).
// Utilizamos unstable_cache para garantir a estratégia de revalidação equivalente ao fetch.
export const getCategorias = unstable_cache(
  async (): Promise<CategoriaServico[]> => {
    const categorias = await prisma.categoriaServico.findMany();
    return categorias;
  },
  ["categorias"],
  {
    revalidate: 86400, // 24 horas
    tags: ["categorias"],
  }
);
