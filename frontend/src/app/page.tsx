"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CategoriaServicoResumo = {
  id: string;
  nome: string;
};

type ProfissionalResumo = {
  servicos: {
    categoria: CategoriaServicoResumo;
  }[];
};

type CategoriasState =
  | { type: "loading"; categorias: CategoriaServicoResumo[] }
  | { type: "success"; categorias: CategoriaServicoResumo[] }
  | { type: "error"; categorias: CategoriaServicoResumo[] };

function getCategoriasFromProfissionais(
  profissionais: ProfissionalResumo[]
) {
  const categorias = new Map<string, CategoriaServicoResumo>();

  for (const profissional of profissionais) {
    for (const servico of profissional.servicos) {
      categorias.set(servico.categoria.id, servico.categoria);
    }
  }

  return Array.from(categorias.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );
}

export default function Home() {
  const [state, setState] = useState<CategoriasState>({
    type: "loading",
    categorias: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCategorias() {
      try {
        const response = await fetch("/api/profissionais");

        if (!response.ok) {
          throw new Error("Erro ao buscar profissionais");
        }

        const profissionais =
          (await response.json()) as ProfissionalResumo[];
        const categorias =
          getCategoriasFromProfissionais(profissionais);

        if (isMounted) {
          setState({ type: "success", categorias });
        }
      } catch {
        if (isMounted) {
          setState({ type: "error", categorias: [] });
        }
      }
    }

    void loadCategorias();

    return () => {
      isMounted = false;
    };
  }, []);

  const categorias = useMemo(
    () => state.categorias,
    [state.categorias]
  );

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

      {state.type === "loading" ? (
        <p>Carregando categorias...</p>
      ) : state.type === "error" ? (
        <p>Não foi possível carregar as categorias.</p>
      ) : (
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
      )}
    </main>
  );
}
