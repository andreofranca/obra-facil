import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RequestStatusBadge } from "./RequestStatusBadge";
import type {
  SolicitacaoProfissionalResumo,
  AtualizarSolicitacaoStatusPayload,
} from "@/types/solicitacao";

export interface RequestCardProps {
  solicitacao: SolicitacaoProfissionalResumo;
  updatingId: string | null;
  onUpdateStatus: (
    id: string,
    status: AtualizarSolicitacaoStatusPayload["status"]
  ) => void;
}

export function RequestCard({
  solicitacao,
  updatingId,
  onUpdateStatus,
}: RequestCardProps) {
  // Placeholder para Categoria, extraída da primeira palavra do título
  const categoriaPlaceholder = solicitacao.titulo.split(" ")[0] || "Serviço";

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(solicitacao.createdAt));

  const isUpdating = updatingId === solicitacao.id;

  // Lógica de ações disponíveis baseadas no status
  let actionButton = null;
  if (solicitacao.status === "ABERTA") {
    actionButton = (
      <Button
        variant="primary"
        isLoading={isUpdating}
        onClick={() => onUpdateStatus(solicitacao.id, "ACEITA")}
      >
        Enviar Proposta
      </Button>
    );
  } else if (solicitacao.status === "ACEITA") {
    actionButton = (
      <Button
        variant="primary"
        isLoading={isUpdating}
        onClick={() => onUpdateStatus(solicitacao.id, "EM_EXECUCAO")}
      >
        Iniciar Serviço
      </Button>
    );
  } else if (solicitacao.status === "EM_EXECUCAO") {
    actionButton = (
      <Button
        variant="primary"
        isLoading={isUpdating}
        onClick={() => onUpdateStatus(solicitacao.id, "CONCLUIDA")}
      >
        Concluir
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6 bg-white/60 backdrop-blur-sm border-neutral-border hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-text/70 uppercase tracking-wider">
            {categoriaPlaceholder}
          </span>
          <h3 className="text-lg font-bold text-neutral-text leading-tight">
            {solicitacao.titulo}
          </h3>
          <p className="text-sm text-neutral-text/60">
            Recebido em {dataFormatada}
          </p>
        </div>
        <div>
          <RequestStatusBadge status={solicitacao.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-neutral-text/50">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-neutral-text">
          {solicitacao.cliente.nome}
        </span>
      </div>

      <p className="text-neutral-text/80 line-clamp-2 mt-1">
        {solicitacao.descricao}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-neutral-border/40">
        <Link href={`/profissional/pedidos/${solicitacao.id}`} tabIndex={-1}>
          <Button variant="outline">Ver detalhes</Button>
        </Link>
        <Link href={`/profissional/pedidos/${solicitacao.id}`} tabIndex={-1}>
          <Button variant="outline">Conversar</Button>
        </Link>
        {actionButton}
      </div>
    </Card>
  );
}
