import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface CompletionStatusBadgeProps {
  status: SolicitacaoServicoStatus;
}

export function CompletionStatusBadge({ status }: CompletionStatusBadgeProps) {
  if (status === "EM_ANDAMENTO") {
    return (
      <Badge tone="info" className="w-fit">
        Em Andamento
      </Badge>
    );
  }
  
  if (status === "AGUARDANDO_CONFIRMACAO_CLIENTE") {
    return (
      <Badge tone="warning" className="w-fit">
        Aguardando sua Confirmação
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
