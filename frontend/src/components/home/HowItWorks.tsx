import { Card } from "@/components/ui";

const steps = [
  {
    emoji: "📝",
    title: "Solicite o serviço",
    description: "Informe o que precisa e publique sua solicitação.",
  },
  {
    emoji: "📨",
    title: "Receba propostas",
    description: "Profissionais interessados enviarão propostas.",
  },
  {
    emoji: "💬",
    title: "Converse",
    description: "Tire dúvidas e negocie diretamente pelo chat.",
  },
  {
    emoji: "🏆",
    title: "Escolha o profissional",
    description: "Compare propostas e contrate quem melhor atende à sua necessidade.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-it-works-title" className="py-16">
      <div className="mb-8 max-w-[560px]">
        <h2
          id="how-it-works-title"
          className="text-neutral-text font-sans text-3xl font-bold leading-tight m-0"
        >
          Como funciona
        </h2>
        <p className="text-neutral-muted font-sans text-base leading-relaxed mt-3 mb-0">
          Solicite um serviço em poucos passos.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="flex flex-col min-h-[224px] p-6 bg-neutral-surface border border-neutral-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 rounded-2xl relative overflow-hidden motion-reduce:transition-none motion-reduce:transform-none">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-6">
              <div
                aria-hidden="true"
                className="flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-xl text-brand-primary font-sans text-lg font-bold"
              >
                0{index + 1}
              </div>
              <span
                aria-hidden="true"
                className="inline-flex text-3xl leading-tight opacity-80"
              >
                {step.emoji}
              </span>
            </div>
            
            <h3 className="text-neutral-text font-sans text-xl font-bold leading-tight mt-auto mb-2">
              {step.title}
            </h3>
            <p className="text-neutral-muted font-sans text-sm leading-relaxed m-0">
              {step.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
