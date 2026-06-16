import Link from "next/link";
import type { ProfissionalResumo } from "@/types/profissional";

async function getProfissionais(categoria?: string) {
  const url = categoria
    ? `http://localhost:3000/api/profissionais?categoria=${categoria}`
    : "http://localhost:3000/api/profissionais";

  const response = await fetch(url, {
    cache: "no-store",
  });

  return response.json() as Promise<ProfissionalResumo[]>;
}

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;

  const profissionais = await getProfissionais(
    params.categoria
  );

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Profissionais
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profissionais.map((profissional) => (
          <Link
            key={profissional.id}
            href={`/profissionais/${profissional.id}`}
            className="border rounded-lg p-4 shadow block hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold">
              {profissional.user.name}
            </h2>

            <p className="mt-2">
              {profissional.descricao || "Descrição não informada"}
            </p>

            <p className="mt-2">
              Experiência:{" "}
              {profissional.experiencia !== null
                ? `${profissional.experiencia} anos`
                : "Não informada"}
            </p>

            <p className="mt-2 text-sm opacity-80">
              Serviço:
              {" "}
              {profissional.servicos[0]?.titulo || "Não informado"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
