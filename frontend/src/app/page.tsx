import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import type { CategoriaServicoResumo } from "@/types/categoria";

const prisma = new PrismaClient();

async function getCategorias(): Promise<CategoriaServicoResumo[]> {
  return prisma.categoriaServico.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export default async function Home() {
  const categorias = await getCategorias();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Obra Fácil
      </h1>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/meus-pedidos"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Meus Pedidos
        </Link>
        <Link
          href="/login"
          className="inline-block rounded-md border px-4 py-2 font-semibold hover:border-blue-500"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="inline-block rounded-md border px-4 py-2 font-semibold hover:border-blue-500"
        >
          Cadastro
        </Link>
      </div>

      <h2 className="text-xl mb-4">
        Categorias Disponíveis
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/profissionais?categoria=${categoria.nome}`}
            className="border rounded-lg p-4 shadow block hover:border-blue-500 hover:shadow-lg transition-all"
          >
            {categoria.nome}
          </Link>
        ))}
      </div>
    </main>
  );
}
