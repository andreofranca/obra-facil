"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  AtualizarSolicitacaoStatusPayload,
  SolicitacaoProfissionalResumo,
  SolicitacaoServicoStatus,
} from "@/types/solicitacao";

type ProfissionalPedidosClientProps = {
  initialSolicitacoes: SolicitacaoProfissionalResumo[];
  initialErrorMessage: string;
};

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

const actions: {
  label: string;
  status: AtualizarSolicitacaoStatusPayload["status"];
}[] = [
  { label: "Em análise", status: "EM_ANALISE" },
  { label: "Aceitar", status: "ACEITA" },
  { label: "Iniciar", status: "EM_ANDAMENTO" },
  { label: "Concluir", status: "CONCLUIDA" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProfissionalPedidosClient({
  initialSolicitacoes,
  initialErrorMessage,
}: ProfissionalPedidosClientProps) {
  const [solicitacoes, setSolicitacoes] = useState(
    initialSolicitacoes
  );
  const [errorMessage, setErrorMessage] = useState(
    initialErrorMessage
  );
  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  const dashboard = useMemo(
    () => ({
      abertas: solicitacoes.filter(
        (solicitacao) => solicitacao.status === "ABERTA"
      ).length,
      emAndamento: solicitacoes.filter(
        (solicitacao) =>
          solicitacao.status === "EM_ANDAMENTO" ||
          solicitacao.status === "ACEITA" ||
          solicitacao.status === "EM_ANALISE"
      ).length,
      concluidas: solicitacoes.filter(
        (solicitacao) => solicitacao.status === "CONCLUIDA"
      ).length,
    }),
    [solicitacoes]
  );

  async function updateStatus(
    solicitacaoId: string,
    status: AtualizarSolicitacaoStatusPayload["status"]
  ) {
    setUpdatingId(solicitacaoId);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/solicitacoes/${solicitacaoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        setErrorMessage(
          "Não foi possível atualizar o status."
        );
        return;
      }

      setSolicitacoes((currentSolicitacoes) =>
        currentSolicitacoes.map((solicitacao) =>
          solicitacao.id === solicitacaoId
            ? { ...solicitacao, status }
            : solicitacao
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold mb-6">
        Painel do Profissional
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4 shadow">
          <p className="text-sm opacity-80">
            Solicitações abertas
          </p>
          <strong className="text-3xl">
            {dashboard.abertas}
          </strong>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <p className="text-sm opacity-80">Em andamento</p>
          <strong className="text-3xl">
            {dashboard.emAndamento}
          </strong>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <p className="text-sm opacity-80">Concluídas</p>
          <strong className="text-3xl">
            {dashboard.concluidas}
          </strong>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 border rounded-lg p-6 shadow">
          <p className="text-red-600">{errorMessage}</p>
          <Link
            href="/login"
            className="inline-block mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
        </div>
      )}

      {!errorMessage && solicitacoes.length === 0 && (
        <div className="mt-6 border rounded-lg p-6 shadow">
          <p>
            Nenhuma solicitação compatível com seus serviços foi
            encontrada.
          </p>
        </div>
      )}

      {!errorMessage && solicitacoes.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {solicitacoes.map((solicitacao) => (
            <article
              key={solicitacao.id}
              className="border rounded-lg p-5 shadow"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {solicitacao.titulo}
                  </h2>
                  <p className="mt-2 text-sm opacity-80">
                    Cliente: {solicitacao.cliente.nome}
                  </p>
                  <p className="mt-1 text-sm opacity-80">
                    Data: {formatDate(solicitacao.createdAt)}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[solicitacao.status]}`}
                >
                  {statusLabels[solicitacao.status]}
                </span>
              </div>

              <p className="mt-4">{solicitacao.descricao}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/profissional/pedidos/${solicitacao.id}`}
                  className="rounded-md border px-3 py-2 text-sm font-semibold hover:border-blue-500"
                >
                  Ver detalhes
                </Link>

                {actions.map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    disabled={
                      updatingId === solicitacao.id ||
                      solicitacao.status === action.status
                    }
                    onClick={() =>
                      void updateStatus(
                        solicitacao.id,
                        action.status
                      )
                    }
                    className="rounded-md border px-3 py-2 text-sm font-semibold hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
