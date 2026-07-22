import { Button } from "@/components/ui";

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="py-10 md:py-16">
      <div className="relative flex flex-col items-center text-center bg-gradient-to-br from-brand-primary to-[#0f2835] rounded-3xl shadow-[var(--shadow-elevated)] overflow-hidden px-5 sm:px-6 py-12 md:py-20">
        
        {/* Decorative blur elements */}
        <div className="absolute -right-20 -top-20 w-48 h-48 md:w-64 md:h-64 bg-brand-secondary/20 rounded-full blur-[60px]" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 md:w-64 md:h-64 bg-brand-accent/20 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-[720px]">
          <h2
            id="cta-title"
            className="text-neutral-white font-sans text-3xl md:text-4xl font-extrabold tracking-tight leading-tight m-0"
          >
            Pronto para encontrar o profissional ideal?
          </h2>
          <p className="text-neutral-white/90 font-sans text-lg md:text-xl leading-relaxed mt-4 md:mt-5 mb-8 md:mb-10">
            Solicite gratuitamente um serviço ou faça parte da nossa rede de
            profissionais qualificados.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-neutral-white border-neutral-white text-brand-primary hover:bg-neutral-background hover:border-neutral-background shadow-lg shadow-black/10 rounded-full px-8 w-full sm:w-auto"
            >
              Solicitar Serviço
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-neutral-white/50 text-neutral-white hover:bg-neutral-white/10 hover:border-neutral-white rounded-full px-8 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
            >
              Cadastrar como Profissional
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
