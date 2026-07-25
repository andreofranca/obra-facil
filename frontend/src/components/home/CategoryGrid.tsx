import { Card } from "@/components/ui";
import { getCategorias } from "@/lib/services/categorias";
import Link from "next/link";
import * as Icons from "lucide-react";

// Mapping icons explicitly for a premium look, avoiding emojis if possible.
// We fallback to standard Lucide icons based on category name.
const categoryConfig: Record<string, { icon: keyof typeof Icons; description: string }> = {
  "Pedreiro": { icon: "Hammer", description: "Obras, alvenaria e revestimentos." },
  "Eletricista": { icon: "Zap", description: "Instalações e manutenção elétrica." },
  "Encanador": { icon: "Wrench", description: "Hidráulica e vazamentos." },
  "Pintor": { icon: "PaintRoller", description: "Pintura residencial e comercial." },
  "Marceneiro": { icon: "Ruler", description: "Móveis planejados e reparos." },
  "Jardineiro": { icon: "Trees", description: "Paisagismo e manutenção verde." },
  "Gesseiro": { icon: "Brush", description: "Forros, sancas e divisórias." },
  "Marido de Aluguel": { icon: "Toolbox", description: "Pequenos reparos diários." },
};

export async function CategoryGrid() {
  const categorias = await getCategorias();

  return (
    <section aria-labelledby="categories-title" className="py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <h2
          id="categories-title"
          className="text-neutral-text font-sans text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight"
        >
          Qual serviço você precisa?
        </h2>
        <p className="text-neutral-muted font-sans text-lg leading-relaxed">
          Navegue pelas nossas categorias e encontre especialistas verificados prontos para ajudar na sua obra.
        </p>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12 bg-neutral-surface rounded-2xl border border-neutral-border shadow-soft">
          <p className="text-neutral-muted">Nenhuma categoria encontrada no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((categoria) => {
            const config = categoryConfig[categoria.nome] || {
              icon: "Briefcase",
              description: "Serviço especializado de alta qualidade.",
            };
            const IconComponent = Icons[config.icon] as React.ElementType;

            return (
              <Link key={categoria.id} href={`/profissionais?categoria=${encodeURIComponent(categoria.nome)}`} className="block outline-none group focus-visible:ring-2 focus-visible:ring-brand-primary rounded-2xl">
                <Card
                  tabIndex={-1}
                  className="flex flex-col h-full min-h-52 p-6 bg-neutral-surface border border-neutral-border rounded-2xl shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-elevated group-hover:border-brand-primary/30"
                >
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-primary/10 text-brand-primary mb-6 transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-neutral-white"
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" strokeWidth={2} />}
                  </div>
                  <h3 className="text-neutral-text font-sans text-xl font-bold leading-tight mb-2 group-hover:text-brand-primary transition-colors">
                    {categoria.nome}
                  </h3>
                  <p className="text-neutral-muted font-sans text-sm leading-relaxed mt-auto">
                    {config.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
