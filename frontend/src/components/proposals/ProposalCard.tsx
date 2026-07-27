import { Card, Avatar } from "@/components/ui";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import type { PropostaResumo } from "@/types/proposta";
import { ReactNode } from "react";

interface ProposalCardProps {
  proposta: PropostaResumo;
  actions?: ReactNode;
  userRole?: "CLIENT" | "PROFESSIONAL";
}

export function ProposalCard({ proposta, actions, userRole = "CLIENT" }: ProposalCardProps) {
  const profileName = userRole === "CLIENT" ? proposta.profissional.nome : proposta.solicitacao.cliente.nome;
  const profileLabel = userRole === "CLIENT" ? "Profissional" : "Cliente";
  
  const formattedDate = new Date(proposta.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(proposta.valor));

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <Avatar initials={profileName[0]} className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-text">{profileName}</span>
            <span className="text-xs text-neutral-muted">{profileLabel}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <h4 className="font-medium text-neutral-text text-sm">
            Ref: {proposta.solicitacao.titulo}
          </h4>
          <span className="text-xs text-neutral-muted">
            Enviada em {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-muted">Valor</span>
            <span className="text-sm font-semibold text-neutral-text">{formattedValue}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-muted">Prazo</span>
            <span className="text-sm font-semibold text-neutral-text">{proposta.prazoDias} dias</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-4 h-full md:min-h-[100px]">
        <ProposalStatusBadge status={proposta.status} />
        {actions && (
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}
