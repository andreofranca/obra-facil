import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export const ORDER_STATUS_MAP: Record<SolicitacaoServicoStatus, { label: string; tone: "success" | "warning" | "error" | "info" | "neutral" }> = {
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

export interface OrderStatusBadgeProps {
  status: SolicitacaoServicoStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.ABERTA;

  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
