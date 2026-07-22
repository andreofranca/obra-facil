import { Card } from "@/components/ui";
import { getCategorias } from "@/lib/services/categorias";
import Link from "next/link";

const categoryDictionary: Record<string, { emoji: string; description: string }> = {
  "Pedreiro": { emoji: "🧱", description: "Construção, reparos e acabamentos." },
  "Eletricista": { emoji: "⚡", description: "Instalações e reparos elétricos." },
  "Encanador": { emoji: "🔧", description: "Soluções para água e encanamentos." },
  "Pintor": { emoji: "🎨", description: "Pintura e renovação de ambientes." },
  "Marceneiro": { emoji: "🪚", description: "Móveis e projetos sob medida." },
  "Jardineiro": { emoji: "🌿", description: "Cuidados e projetos para jardins." },
  "Gesseiro": { emoji: "🏠", description: "Forros, divisórias e acabamentos." },
  "Marido de Aluguel": { emoji: "🛠️", description: "Pequenos reparos para o dia a dia." },
};

export async function CategoryGrid() {
  const categorias = await getCategorias();

  return (
    <section aria-labelledby="categories-title" className="py-16">
      <div className="mb-8 max-w-[560px]">
        <h2
          id="categories-title"
          className="text-neutral-text font-sans text-3xl font-bold leading-tight m-0"
        >
          Encontre o serviço ideal
        </h2>
        <p className="text-neutral-muted font-sans text-base leading-relaxed mt-3 mb-0">
          Selecione uma categoria e encontre profissionais especializados.
        </p>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12 bg-neutral-surface rounded-lg border border-neutral-border">
          <p className="text-neutral-muted">Nenhuma categoria encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {categorias.map((categoria) => {
            const data = categoryDictionary[categoria.nome] || {
              emoji: "📌",
              description: "Serviço especializado para sua necessidade.",
            };

            return (
              <Link key={categoria.id} href={`/profissionais?categoria=${encodeURIComponent(categoria.nome)}`} className="block outline-none group">
                <Card
                  tabIndex={-1}
                  className="flex flex-col min-h-[168px] cursor-pointer transition-all duration-300 ease-out bg-neutral-surface border-neutral-border shadow-[var(--shadow-soft)] group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-elevated)] group-hover:border-brand-primary/30 group-focus-within:-translate-y-1 group-focus-within:shadow-[var(--shadow-elevated)] group-focus-within:border-brand-primary/50 h-full p-6 motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary/5 text-2xl transition-colors duration-300 group-hover:bg-brand-primary/10"
                  >
                    {data.emoji}
                  </div>
                  <h3 className="text-neutral-text font-sans text-lg font-bold leading-tight mt-5 mb-2 transition-colors duration-300 group-hover:text-brand-primary">
                    {categoria.nome}
                  </h3>
                  <p className="text-neutral-muted font-sans text-sm leading-relaxed m-0">
                    {data.description}
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
