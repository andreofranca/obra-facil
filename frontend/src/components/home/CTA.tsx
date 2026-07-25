import { Button } from "@/components/ui";

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="py-16 md:py-24">
      <div className="relative flex flex-col items-center text-center bg-brand-primary rounded-3xl shadow-elevated overflow-hidden px-6 py-16 md:py-24 mx-auto max-w-5xl">
        
        {/* Decorative blur elements for Premium Feel */}
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-brand-secondary/30 rounded-full blur-3xl" />
        <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <h2
            id="cta-title"
            className="text-neutral-white font-sans text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6"
          >
            Pronto para começar sua obra?
          </h2>
          <p className="text-neutral-white/90 font-sans text-lg md:text-xl leading-relaxed mb-10">
            Publique sua necessidade agora e receba orçamentos gratuitos dos melhores profissionais da sua região.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-neutral-white text-brand-primary hover:bg-neutral-background border-none shadow-lg shadow-black/10 rounded-full px-10 h-14 text-lg font-bold w-full sm:w-auto transition-transform hover:-translate-y-1"
            >
              Solicitar orçamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
