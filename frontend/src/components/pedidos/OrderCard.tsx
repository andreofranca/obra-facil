import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { SolicitacaoServicoResumo } from "@/types/solicitacao";

export interface OrderCardProps {
  solicitacao: SolicitacaoServicoResumo;
}

export function OrderCard({ solicitacao }: OrderCardProps) {
  // Placeholder para a categoria. Como não há no schema atual, extraímos a primeira palavra do título ou fixamos.
  const categoriaPlaceholder = solicitacao.titulo.split(" ")[0] || "Serviço";
  
  // Placeholder para indicador de propostas
  // Valor estático/determinístico para o layout premium, conforme as regras da sprint
  const propostasCount = solicitacao.id.length % 5;

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(solicitacao.createdAt));

  return (
    <Card className="flex flex-col gap-4 p-6 hover:shadow-md transition-shadow duration-300 ease-in-out border-neutral-border/60 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-text/70 uppercase tracking-wider">
            {categoriaPlaceholder}
          </span>
          <h3 className="text-xl font-bold text-neutral-text leading-tight">
            {solicitacao.titulo}
          </h3>
          <p className="text-sm text-neutral-text/60">
            Solicitado em {dataFormatada}
          </p>
        </div>
        <div>
          <OrderStatusBadge status={solicitacao.status} />
        </div>
      </div>

      <p className="text-neutral-text/80 line-clamp-2 mt-2">
        {solicitacao.descricao}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-text/70 uppercase tracking-wider">
            Profissional
          </span>
          <span className="text-sm font-medium text-neutral-text">
            {solicitacao.profissional?.nome || "Ainda não definido"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-text/70 uppercase tracking-wider">
            Propostas
          </span>
          <span className="text-sm font-medium text-neutral-text">
            {propostasCount} {propostasCount === 1 ? "proposta recebida" : "propostas recebidas"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-neutral-border/40">
        <Link href={`/minhas-solicitacoes/${solicitacao.id}`} className="flex-1" tabIndex={-1}>
          <Button variant="outline" className="w-full">
            Ver detalhes
          </Button>
        </Link>
        <Link href={`/minhas-solicitacoes/${solicitacao.id}`} className="flex-1" tabIndex={-1}>
          <Button variant="primary" className="w-full">
            Conversar
          </Button>
        </Link>
      </div>
    </Card>
  );
}
