import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export const REQUEST_STATUS_MAP: Record<
  SolicitacaoServicoStatus,
  { label: string; tone: "neutral" | "success" | "warning" | "error" | "info" }
> = {
  ABERTA: { label: "Nova solicitação", tone: "info" },
  EM_ANALISE: { label: "Em análise", tone: "warning" },
  ACEITA: { label: "Proposta recebida", tone: "success" },
  EM_ANDAMENTO: { label: "Em execução", tone: "info" },
  AGUARDANDO_CONFIRMACAO_CLIENTE: { label: "Aguardando confirmação", tone: "warning" },
  CONCLUIDA: { label: "Finalizado", tone: "success" },
  CANCELADA: { label: "Cancelado", tone: "error" },
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
