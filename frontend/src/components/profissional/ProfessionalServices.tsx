import React from "react";
import { Card } from "@/components/ui";
import { Wrench } from "lucide-react";

type Service = {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: { nome: string };
};

export function ProfessionalServices({ services }: { services: Service[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="space-y-6 pt-8 mt-8 border-t border-neutral-border/50 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      <h2 className="text-2xl font-bold text-neutral-text tracking-tight">Serviços Oferecidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((servico) => (
          <Card key={servico.id} className="p-5 bg-neutral-surface border border-neutral-border shadow-soft hover:shadow-elevated transition-shadow duration-300 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-text text-lg leading-tight flex-1 line-clamp-2">
                {servico.titulo}
              </h3>
            </div>
            {servico.descricao && (
              <p className="text-sm text-neutral-muted line-clamp-3 leading-relaxed mt-2">
                {servico.descricao}
              </p>
            )}
            <div className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wider text-neutral-muted">
              Categoria: {servico.categoria.nome}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
