import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export const REQUEST_STATUS_MAP: Record<
  SolicitacaoServicoStatus,
  { label: string; tone: "neutral" | "success" | "warning" | "error" | "info" }
> = {
  ABERTA: { label: "Aberta", tone: "neutral" },
  PROPOSTAS: { label: "Propostas", tone: "info" },
  NEGOCIACAO: { label: "Negociação", tone: "warning" },
  ACEITA: { label: "Aceita", tone: "success" },
  EM_EXECUCAO: { label: "Em execução", tone: "info" },
  CONCLUIDA: { label: "Concluída", tone: "success" },
  CANCELADA: { label: "Cancelada", tone: "error" },
  EXPIRADA: { label: "Expirada", tone: "error" },
  RECUSADA: { label: "Recusada", tone: "error" },
};

export interface RequestStatusBadgeProps {
  status: SolicitacaoServicoStatus;
  className?: string;
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const config = REQUEST_STATUS_MAP[status] || REQUEST_STATUS_MAP.ABERTA;

  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
