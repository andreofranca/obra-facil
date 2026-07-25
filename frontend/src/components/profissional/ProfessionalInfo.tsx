import React from "react";
import { Badge } from "@/components/ui";

type ProfessionalInfoProps = {
  description: string | null;
  experience: number | null;
  categoryName: string;
};

export function ProfessionalInfo({ description, experience, categoryName }: ProfessionalInfoProps) {
  return (
    <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      <div>
        <h2 className="text-2xl font-bold text-neutral-text tracking-tight mb-4">Sobre o profissional</h2>
        <div className="prose prose-neutral max-w-none text-neutral-muted leading-relaxed">
          <p>{description || "Este profissional ainda não adicionou uma descrição detalhada sobre seu trabalho na plataforma, porém ele passou por todas as etapas de verificação."}</p>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-sm font-bold text-neutral-text uppercase tracking-wider mb-3">Especialidade Principal</h3>
        <div className="flex flex-wrap gap-2">
          <Badge tone="info" className="text-sm px-3 py-1 shadow-sm">{categoryName}</Badge>
          {experience !== null && experience > 0 && (
            <Badge tone="neutral" className="text-sm px-3 py-1 bg-neutral-surface border border-neutral-border">
              {experience} {experience === 1 ? "ano" : "anos"} de experiência
            </Badge>
          )}
        </div>
      </div>
    </section>
  );
}
