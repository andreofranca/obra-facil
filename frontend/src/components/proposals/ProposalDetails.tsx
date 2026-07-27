import { Card, Avatar } from "@/components/ui";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { ProposalTimeline } from "./ProposalTimeline";
import type { PropostaResumo } from "@/types/proposta";
import { ReactNode } from "react";

interface ProposalDetailsProps {
  proposta: PropostaResumo;
  userRole?: "CLIENT" | "PROFESSIONAL";
  actions?: ReactNode;
}

export function ProposalDetails({ proposta, userRole = "CLIENT", actions }: ProposalDetailsProps) {
  const profileName = userRole === "CLIENT" ? proposta.profissional.nome : proposta.solicitacao.cliente.nome;
  const profileLabel = userRole === "CLIENT" ? "Profissional" : "Cliente";

  const formattedDate = new Date(proposta.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(proposta.valor));

  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-neutral-text">
            Proposta para: {proposta.solicitacao.titulo}
          </h2>
          <span className="text-sm text-neutral-muted">Enviada em {formattedDate}</span>
        </div>
        <ProposalStatusBadge status={proposta.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4 col-span-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-neutral-text">Mensagem do Profissional</h3>
            <div className="bg-neutral-background p-4 rounded-lg text-sm text-neutral-text whitespace-pre-wrap">
              {proposta.mensagem}
            </div>
          </div>
          
          <ProposalTimeline status={proposta.status} createdAt={proposta.createdAt} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 bg-neutral-background p-4 rounded-lg border border-neutral-border">
            <div className="flex items-center gap-3">
              <Avatar initials={profileName[0]} className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-text">{profileName}</span>
                <span className="text-xs text-neutral-muted">{profileLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-muted">Valor Total</span>
                <span className="text-lg font-bold text-brand-primary">{formattedValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-muted">Prazo Estimado</span>
                <span className="text-sm font-semibold text-neutral-text">{proposta.prazoDias} dias</span>
              </div>
            </div>
          </div>
          
          {actions && (
            <div className="flex flex-col gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
