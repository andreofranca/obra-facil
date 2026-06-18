import Link from "next/link";
import { notFound } from "next/navigation";
import type { ProfissionalResumo } from "@/types/profissional";

async function getProfissional(
  id: string
): Promise<ProfissionalResumo | null> {
  const response = await fetch(
    `http://localhost:3000/api/profissionais?id=${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProfissionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profissional = await getProfissional(id);

  if (!profissional) {
    notFound();
  }

  const principalServico = profissional.servicos[0];

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        {profissional.user.name}
      </h1>

      <div className="border rounded-lg p-6 shadow max-w-2xl">
        <p className="mb-4">
          <strong>Descrição:</strong>
          <br />
          {profissional.descricao || "Não informada"}
        </p>

        <p className="mb-4">
          <strong>Experiência:</strong>
          <br />
          {profissional.experiencia !== null
            ? `${profissional.experiencia} anos`
            : "Não informada"}
        </p>

        <p className="mb-4">
          <strong>Serviço:</strong>
          <br />
          {principalServico?.titulo || "Não informado"}
        </p>

        <p className="mb-4">
          <strong>Categoria:</strong>
          <br />
          {principalServico?.categoria.nome || "Não informada"}
        </p>

        <p className="mb-4">
          <strong>Email:</strong>
          <br />
          {profissional.user.email}
        </p>

        <p className="mb-4">
          <strong>Telefone:</strong>
          <br />
          {profissional.user.phone || "Não informado"}
        </p>

        <Link
          href={`/solicitar-servico?profissionalId=${profissional.id}`}
          className="inline-block rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Solicitar Serviço
        </Link>
      </div>
    </main>
  );
}
