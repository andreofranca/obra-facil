import React from "react";
import { Badge } from "@/components/ui";

type ProfessionalHeroProps = {
  name: string;
  specialty: string;
  rating: string;
  totalReviews: number;
};

export function ProfessionalHero({ name, specialty, rating, totalReviews }: ProfessionalHeroProps) {
  // Gera Iniciais determinísticas
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full relative mb-16 md:mb-24">
      {/* Imagem de Capa (Genérica/Gradiente Premium) */}
      <div className="h-48 md:h-64 lg:h-72 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary rounded-b-3xl relative overflow-hidden shadow-soft border-b border-x border-neutral-border/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Avatar e Informações Básicas sobrepostas */}
      <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-12 lg:left-24 flex items-end gap-5 md:gap-8 max-w-7xl w-full">
        <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-neutral-surface border-4 border-neutral-background shadow-elevated rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-neutral-background to-neutral-surface flex items-center justify-center text-4xl md:text-5xl font-extrabold text-brand-primary">
            {initials}
          </div>
        </div>

        <div className="hidden md:block pb-2 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-text tracking-tight drop-shadow-sm">
              {name}
            </h1>
            <Badge tone="success" className="px-2 py-0.5 shadow-sm">Verificado</Badge>
          </div>
          <p className="text-lg text-brand-primary font-medium tracking-tight">
            {specialty}
          </p>
        </div>
      </div>
    </div>
  );
}
