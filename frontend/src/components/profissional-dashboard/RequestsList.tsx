import { RequestCard } from "./RequestCard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import type {
  SolicitacaoProfissionalResumo,
  AtualizarSolicitacaoStatusPayload,
} from "@/types/solicitacao";

export interface RequestsListProps {
  solicitacoes: SolicitacaoProfissionalResumo[];
  updatingId: string | null;
  onUpdateStatus: (
    id: string,
    status: AtualizarSolicitacaoStatusPayload["status"]
  ) => void;
}

export function RequestsList({
  solicitacoes,
  updatingId,
  onUpdateStatus,
}: RequestsListProps) {
  if (!solicitacoes || solicitacoes.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="flex flex-col gap-6">
      {solicitacoes.map((solicitacao) => (
        <RequestCard
          key={solicitacao.id}
          solicitacao={solicitacao}
          updatingId={updatingId}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}
