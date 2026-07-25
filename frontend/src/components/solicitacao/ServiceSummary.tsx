import React from "react";
import { Card } from "@/components/ui";

type ServiceSummaryProps = {
  titulo: string;
  descricao: string;
  localizacao: string;
  dataPreferencial: string;
};

export function ServiceSummary({ titulo, descricao, localizacao, dataPreferencial }: ServiceSummaryProps) {
  return (
    <Card className="p-6 bg-neutral-background border border-neutral-border shadow-soft rounded-2xl">
      <h3 className="font-bold text-neutral-text text-lg mb-4 pb-2 border-b border-neutral-border/50">
        Resumo da Solicitação
      </h3>
      
      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-semibold text-neutral-muted uppercase tracking-wider mb-1">Título</dt>
          <dd className="text-neutral-text font-medium">{titulo || "Não informado"}</dd>
        </div>
        
        <div>
          <dt className="text-sm font-semibold text-neutral-muted uppercase tracking-wider mb-1">Localização</dt>
          <dd className="text-neutral-text font-medium">{localizacao || "Não informada"}</dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-muted uppercase tracking-wider mb-1">Data Preferencial</dt>
          <dd className="text-neutral-text font-medium">{dataPreferencial || "Flexível / A combinar"}</dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-muted uppercase tracking-wider mb-1">Descrição Detalhada</dt>
          <dd className="text-neutral-text leading-relaxed whitespace-pre-wrap mt-2 p-4 bg-neutral-surface rounded-xl border border-neutral-border/50">
            {descricao || "Nenhuma descrição fornecida."}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
