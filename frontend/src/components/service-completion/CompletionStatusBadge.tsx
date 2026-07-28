import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface CompletionStatusBadgeProps {
  status: SolicitacaoServicoStatus;
}

export function CompletionStatusBadge({ status }: CompletionStatusBadgeProps) {
  if (status === "EM_EXECUCAO") {
    return (
      <Badge tone="info" className="w-fit">
        Em Andamento
      </Badge>
    );
  }
  
  if (status === "CONCLUIDA") {
    return (
      <Badge tone="success" className="w-fit">
        Serviço Concluído
      </Badge>
    );
  }

  return null;
}
