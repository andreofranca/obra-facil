import { Card } from "@/components/ui/Card";
import { getProfissionais } from "@/lib/services/profissionais";
import Link from "next/link";

export async function FeaturedProfessionals() {
  const profissionaisAll = await getProfissionais();
  const profissionais = profissionaisAll.slice(0, 4);

  return (
    <section aria-labelledby="featured-professionals-title" className="py-16">
      <div className="mb-10 max-w-[560px]">
        <h2
          id="featured-professionals-title"
          className="text-neutral-text font-sans text-3xl font-bold leading-tight m-0"
        >
          Profissionais em Destaque
        </h2>
        <p className="text-neutral-muted font-sans text-base leading-relaxed mt-3 mb-0">
          Conheça alguns dos melhores talentos disponíveis na plataforma, avaliados pela comunidade.
        </p>
      </div>

      {profissionais.length === 0 ? (
        <div className="text-center py-16 bg-neutral-surface rounded-2xl border border-neutral-border">
          <p className="text-neutral-muted font-medium">Nenhum profissional em destaque no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {profissionais.map((profissional) => {
            const initials = profissional.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            let reviewsCount = 0;
            let rating = 0;
            if (profissional.avaliacoes && profissional.avaliacoes.length > 0) {
              reviewsCount = profissional.avaliacoes.length;
              rating = Math.round(
                profissional.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / reviewsCount
              );
            }
            const stars = rating > 0 ? "★".repeat(rating) + "☆".repeat(5 - rating) : "☆☆☆☆☆";

            return (
              <Link key={profissional.id} href={`/profissionais/${profissional.id}`} className="block outline-none group">
                <Card
                  tabIndex={-1}
                  className="flex flex-col gap-5 min-h-[360px] cursor-pointer transition-all duration-300 ease-out bg-neutral-surface border-neutral-border shadow-[var(--shadow-soft)] group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-elevated)] group-hover:border-brand-primary/20 h-full p-6 rounded-2xl motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="flex flex-none items-center justify-center w-14 h-14 bg-brand-primary/10 rounded-2xl text-brand-primary font-sans text-base font-bold transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-neutral-white"
                    >
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-neutral-text font-sans text-lg font-bold leading-tight m-0 transition-colors duration-300 group-hover:text-brand-primary">
                        {profissional.user.name}
                      </h3>
                      <p className="text-neutral-muted font-sans text-sm font-medium leading-normal mt-1 mb-0 line-clamp-1">
                        {profissional.servicos[0]?.titulo || "Profissional parceiro"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      aria-label={`Avaliação de ${rating} estrelas`}
                      className="text-brand-accent text-base tracking-[0.04em] leading-tight drop-shadow-sm"
                    >
                      {stars}
                    </span>
                    <span className="text-neutral-muted font-sans text-xs font-medium leading-normal">
                      {reviewsCount > 0 ? `${reviewsCount} avaliações` : "Novo talento"}
                    </span>
                  </div>

                  <p className="text-neutral-muted font-sans text-sm leading-relaxed m-0 flex-1 line-clamp-3">
                    {profissional.descricao || "Profissional certificado e verificado pela plataforma."}
                  </p>

                  <div className="mt-auto pt-5 border-t border-neutral-border/50">
                    <span className="inline-flex items-center justify-center w-full min-h-11 px-4 py-2 text-sm bg-neutral-white border border-neutral-border rounded-xl text-neutral-text font-sans font-semibold leading-tight transition-all duration-300 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-neutral-white shadow-sm">
                      Ver Perfil Completo
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
