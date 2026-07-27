import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  status: SolicitacaoServicoStatus;
  lastUpdate?: string;
}

const statusColorMap: Record<SolicitacaoServicoStatus, "neutral" | "success" | "warning" | "error" | "info"> = {
  ABERTA: "neutral",
  EM_ANALISE: "warning",
  ACEITA: "info",
  EM_ANDAMENTO: "info",
  AGUARDANDO_CONFIRMACAO_CLIENTE: "warning",
  CONCLUIDA: "success",
  CANCELADA: "error",
};

const statusLabelMap: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em Análise",
  ACEITA: "Aceita",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_CONFIRMACAO_CLIENTE: "Aguardando confirmação",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

export function ChatHeader({ title, subtitle, status, lastUpdate }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-border bg-neutral-surface">
      <div className="flex items-center gap-3">
        <Avatar initials={title[0] || "?"} className="w-10 h-10" />
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-neutral-text">{title}</h2>
          <span className="text-xs text-neutral-muted">{subtitle}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Badge tone={statusColorMap[status] || "neutral"}>
          {statusLabelMap[status] || status}
        </Badge>
        {lastUpdate && (
          <span className="text-xs text-neutral-muted hidden sm:inline-block">
            Atualizado {lastUpdate}
          </span>
        )}
      </div>
    </div>
  );
}
