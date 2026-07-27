"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  DashboardHeader,
  DashboardStats,
  RequestsList,
  DashboardSidebar,
} from "@/components/profissional-dashboard";
import type {
  AtualizarSolicitacaoStatusPayload,
  SolicitacaoProfissionalResumo,
} from "@/types/solicitacao";

import type { RatingSummary } from "@/domain/RatingService";
import { ReviewSummary } from "@/components/reviews";

type ProfissionalPedidosClientProps = {
  initialSolicitacoes: SolicitacaoProfissionalResumo[];
  initialErrorMessage: string;
  profissionalNome: string;
  summary: RatingSummary;
};

export default function ProfissionalPedidosClient({
  initialSolicitacoes,
  initialErrorMessage,
  profissionalNome,
  summary,
}: ProfissionalPedidosClientProps) {
  const [solicitacoes, setSolicitacoes] = useState(initialSolicitacoes);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dashboard = useMemo(() => {
    return {
      abertas: solicitacoes.filter((s) => s.status === "ABERTA").length,
      emAndamento: solicitacoes.filter(
        (s) =>
          s.status === "EM_ANDAMENTO" ||
          s.status === "ACEITA" ||
          s.status === "EM_ANALISE"
      ).length,
      concluidas: solicitacoes.filter((s) => s.status === "CONCLUIDA").length,
    };
  }, [solicitacoes]);

  async function updateStatus(
    solicitacaoId: string,
    status: AtualizarSolicitacaoStatusPayload["status"]
  ) {
    setUpdatingId(solicitacaoId);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/solicitacoes/${solicitacaoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setErrorMessage("Não foi possível atualizar o status.");
        return;
      }

      setSolicitacoes((current) =>
        current.map((solicitacao) =>
          solicitacao.id === solicitacaoId
            ? { ...solicitacao, status }
            : solicitacao
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (errorMessage) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-12 bg-white/60 backdrop-blur-sm border border-neutral-border rounded-xl text-center">
        <h3 className="text-xl font-bold text-feedback-error mb-2">Erro</h3>
        <p className="text-neutral-text/70 max-w-md mb-8">{errorMessage}</p>
        <Link href="/login" tabIndex={-1}>
          <Button variant="primary">Fazer Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 px-4 sm:px-10 pb-10">
      <DashboardHeader nome={profissionalNome} />

      <DashboardStats
        abertas={dashboard.abertas}
        emAndamento={dashboard.emAndamento}
        concluidas={dashboard.concluidas}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-text mb-4">
          Sua Reputação
        </h2>
        <ReviewSummary summary={summary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-neutral-text mb-4">
            Solicitações Recentes
          </h2>
          <RequestsList
            solicitacoes={solicitacoes}
            updatingId={updatingId}
            onUpdateStatus={updateStatus}
          />
        </div>

        <div className="lg:col-span-1 sticky top-6">
          <DashboardSidebar />
        </div>
      </div>
    </div>
  );
}
