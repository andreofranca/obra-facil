import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { CheckCircle2, ArrowRight } from "lucide-react";

type RequestSuccessProps = {
  protocolo: string;
};

export function RequestSuccess({ protocolo }: RequestSuccessProps) {
  return (
    <div className="text-center py-10 animate-fade-in-up">
      <div className="w-24 h-24 bg-feedback-success/10 text-feedback-success rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-neutral-text mb-4">Solicitação Enviada!</h2>
      <p className="text-lg text-neutral-muted max-w-lg mx-auto mb-2">
        Sua solicitação de serviço foi encaminhada com sucesso para o profissional.
      </p>
      
      <div className="bg-neutral-surface border border-neutral-border p-4 rounded-xl max-w-sm mx-auto mb-10 shadow-sm">
        <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider mb-1">Protocolo</span>
        <span className="block font-mono text-xl text-brand-primary font-bold">{protocolo}</span>
      </div>

      <Link href="/meus-pedidos" className="inline-block outline-none">
        <Button size="lg" className="shadow-elevated rounded-xl">
          <span className="flex items-center gap-2">
            Acompanhar meus pedidos
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </Link>
    </div>
  );
}
