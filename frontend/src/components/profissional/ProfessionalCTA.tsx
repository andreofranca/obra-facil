import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export function ProfessionalCTA({ profissionalId }: { profissionalId: string }) {
  return (
    <section className="mt-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-8 md:p-12 text-center shadow-elevated relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "250ms" }}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-white mb-4 tracking-tight drop-shadow-sm">
          Pronto para começar sua obra?
        </h2>
        <p className="text-brand-primary-foreground/90 text-lg mb-8 leading-relaxed">
          Entre em contato agora mesmo. Descreva sua necessidade, receba uma estimativa de prazo e garanta o melhor serviço da região.
        </p>
        
        <Link href={`/solicitar-servico?profissionalId=${profissionalId}`} className="inline-block outline-none">
          <Button size="lg" className="bg-neutral-white text-brand-primary hover:bg-neutral-background hover:text-brand-secondary shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 rounded-xl font-bold px-10 border-none">
            Solicitar Serviço
          </Button>
        </Link>
      </div>
    </section>
  );
}
