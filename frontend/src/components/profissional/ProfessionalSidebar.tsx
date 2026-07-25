import React from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Clock, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

type ProfessionalSidebarProps = {
  profissionalId: string;
  ativo: boolean;
  city?: string;
  responseTime?: string;
};

export function ProfessionalSidebar({ profissionalId, ativo, city = "São Paulo, SP", responseTime = "Até 2 horas" }: ProfessionalSidebarProps) {
  return (
    <div className="sticky top-24 bg-neutral-surface rounded-3xl border border-neutral-border p-6 shadow-soft space-y-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      
      <div className="flex items-center justify-between pb-4 border-b border-neutral-border/50">
        <h3 className="font-bold text-neutral-text text-lg">Informações Adicionais</h3>
        <Badge tone={ativo ? "success" : "neutral"} className="shadow-sm">
          {ativo ? "Disponível" : "Indisponível"}
        </Badge>
      </div>

      <div className="space-y-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex flex-none items-center justify-center text-brand-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Área atendida</p>
            <p className="text-neutral-text font-medium mt-0.5">{city}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex flex-none items-center justify-center text-brand-primary">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Tempo de resposta</p>
            <p className="text-neutral-text font-medium mt-0.5">{responseTime}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-feedback-success/10 flex flex-none items-center justify-center text-feedback-success">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Garantia</p>
            <p className="text-neutral-text font-medium mt-0.5">Identidade Verificada</p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Link href={`/solicitar-servico?profissionalId=${profissionalId}`} className="block w-full outline-none group">
          <Button size="lg" className="w-full shadow-elevated rounded-xl transition-transform group-hover:-translate-y-1">
            <span className="flex items-center gap-2">
              Solicitar Orçamento
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
        <p className="text-center text-xs text-neutral-muted mt-3 font-medium">
          O contato é totalmente gratuito e sem compromisso.
        </p>
      </div>

    </div>
  );
}
