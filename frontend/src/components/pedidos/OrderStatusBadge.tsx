import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export const ORDER_STATUS_MAP: Record<
  SolicitacaoServicoStatus,
  { label: string; tone: "neutral" | "success" | "warning" | "error" | "info" }
> = {
  ABERTA: { label: "Solicitado", tone: "info" },
  EM_ANALISE: { label: "Em análise", tone: "warning" },
  ACEITA: { label: "Proposta recebida", tone: "success" },
  EM_ANDAMENTO: { label: "Em execução", tone: "info" },
  AGUARDANDO_CONFIRMACAO_CLIENTE: { label: "Em execução", tone: "info" },
  CONCLUIDA: { label: "Finalizado", tone: "success" },
  CANCELADA: { label: "Cancelado", tone: "error" },
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
