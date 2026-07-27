import { Badge } from "@/components/ui";

export type PropostaStatus = "PENDENTE" | "ACEITA" | "RECUSADA" | "CANCELADA" | "EXPIRADA";

interface ProposalStatusBadgeProps {
  status: PropostaStatus;
}

export function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
  const config = {
    PENDENTE: { tone: "warning" as const, label: "Pendente" },
    ACEITA: { tone: "success" as const, label: "Aceita" },
    RECUSADA: { tone: "error" as const, label: "Recusada" },
    CANCELADA: { tone: "neutral" as const, label: "Cancelada" },
    EXPIRADA: { tone: "neutral" as const, label: "Expirada" },
  };

  const { tone, label } = config[status] || config.PENDENTE;

  return <Badge tone={tone}>{label}</Badge>;
}
