import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfissionalPedidosClient from "@/components/profissional/ProfissionalPedidosClient";
import { getAuthSession } from "@/lib/auth";
import type { SolicitacaoProfissionalResumo } from "@/types/solicitacao";

async function getSolicitacoesProfissional(): Promise<{
  solicitacoes: SolicitacaoProfissionalResumo[];
  errorMessage: string;
}> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(
    "http://localhost:3000/api/profissional/solicitacoes",
    {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) {
    return {
      solicitacoes: [],
      errorMessage:
        "Não foi possível carregar as solicitações do profissional.",
    };
  }

  return {
    solicitacoes:
      (await response.json()) as SolicitacaoProfissionalResumo[],
    errorMessage: "",
  };
}

export default async function ProfissionalPedidosPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "PROFESSIONAL") {
    return (
      <main className="p-10">
        <div className="max-w-3xl border rounded-lg p-6 shadow">
          <h1 className="text-3xl font-bold mb-4">
            Painel do Profissional
          </h1>
          <p>
            Esta área está disponível apenas para usuários
            profissionais.
          </p>
        </div>
      </main>
    );
  }

  const { solicitacoes, errorMessage } =
    await getSolicitacoesProfissional();

  return (
    <main className="p-10">
      <ProfissionalPedidosClient
        initialSolicitacoes={solicitacoes}
        initialErrorMessage={errorMessage}
      />
    </main>
  );
}
