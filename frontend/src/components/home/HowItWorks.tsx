import { ClipboardEdit, MessagesSquare, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardEdit,
    title: "Descreva seu serviço",
    description: "Publique sua necessidade rapidamente.",
  },
  {
    icon: MessagesSquare,
    title: "Receba propostas",
    description: "Compare orçamentos de profissionais.",
  },
  {
    icon: CheckCircle2,
    title: "Escolha o profissional",
    description: "Contrate com confiança e segurança.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-it-works-title" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-neutral-background to-transparent -z-10" />
      
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2
          id="how-it-works-title"
          className="text-neutral-text font-sans text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight"
        >
          Como funciona?
        </h2>
        <p className="text-neutral-muted font-sans text-lg leading-relaxed">
          O processo é simples, rápido e transparente. Veja como encontrar o profissional ideal em 3 passos.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Connection Line (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-primary/10 via-brand-primary/40 to-brand-primary/10 z-0" />

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 relative z-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className="flex flex-col items-center text-center group">
                <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                  {/* Decorative background circles */}
                  <div className="absolute inset-0 bg-neutral-surface rounded-full shadow-sm border border-neutral-border z-10 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-2 bg-brand-primary/5 rounded-full z-10 transition-colors duration-300 group-hover:bg-brand-primary/10" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-secondary text-neutral-white font-bold rounded-full flex items-center justify-center z-20 shadow-md ring-4 ring-neutral-surface">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <IconComponent className="w-10 h-10 text-brand-primary z-20" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-neutral-text font-sans text-xl font-bold leading-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-muted font-sans text-base leading-relaxed max-w-[240px]">
                  {step.description}
                </p>

                {/* Arrow pointing down for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden mt-8 text-brand-primary/40">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
