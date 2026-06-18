import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type {
  SolicitacaoServicoResumo,
  SolicitacaoServicoStatus,
} from "@/types/solicitacao";

const statusLabels: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em análise",
  ACEITA: "Aceita",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

const statusClasses: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "bg-blue-100 text-blue-700",
  EM_ANALISE: "bg-yellow-100 text-yellow-800",
  ACEITA: "bg-emerald-100 text-emerald-700",
  EM_ANDAMENTO: "bg-indigo-100 text-indigo-700",
  CONCLUIDA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

async function getSolicitacoes(): Promise<
  SolicitacaoServicoResumo[]
> {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.clienteId) {
    return [];
  }

  const response = await fetch(
    `http://localhost:3000/api/solicitacoes?clienteId=${session.clienteId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default async function MeusPedidosPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const solicitacoes = await getSolicitacoes();

  return (
    <main className="p-10">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">
          Meus Pedidos
        </h1>

        <p className="mb-6">
          Cliente: <strong>{session.name}</strong>
        </p>

        <Link
          href="/minhas-propostas"
          className="inline-block mb-6 rounded-md border px-3 py-2 text-sm font-semibold hover:border-blue-500"
        >
          Ver propostas recebidas
        </Link>

        {solicitacoes.length === 0 ? (
          <div className="border rounded-lg p-6 shadow">
            <p>
              Nenhuma solicitação encontrada para este cliente.
            </p>
            <Link
              href="/solicitar-servico"
              className="inline-block mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Solicitar Serviço
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {solicitacoes.map((solicitacao) => (
              <article
                key={solicitacao.id}
                className="border rounded-lg p-5 shadow"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {solicitacao.titulo}
                    </h2>
                    <p className="mt-2 text-sm opacity-80">
                      {formatDate(solicitacao.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[solicitacao.status]}`}
                  >
                    {statusLabels[solicitacao.status]}
                  </span>
                </div>

                <p className="mt-4">
                  {solicitacao.descricao}
                </p>

                <p className="mt-4 text-sm opacity-80">
                  Profissional:{" "}
                  {solicitacao.profissional?.nome ||
                    "Ainda não definido"}
                </p>

                <Link
                  href={`/minhas-solicitacoes/${solicitacao.id}`}
                  className="inline-block mt-5 rounded-md border px-3 py-2 text-sm font-semibold hover:border-blue-500"
                >
                  Ver detalhes
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
