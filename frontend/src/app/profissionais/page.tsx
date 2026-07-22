import Link from "next/link";
import { getProfissionais } from "@/lib/services/profissionais";
import { Button, Card, Badge, Input } from "@/components/ui";

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { categoria, q } = params;

  // revalidate 0 (no-store) pois a busca pode precisar de dados fresquinhos
  const profissionais = await getProfissionais({ categoria, q, revalidate: 0 });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
      <div className="mb-10">
        <h1 className="text-neutral-text font-sans text-4xl font-bold leading-tight mb-4">
          Profissionais
        </h1>
        <p className="text-neutral-muted font-sans text-lg">
          {q 
            ? `Resultados para "${q}"` 
            : categoria 
              ? `Especialistas em ${categoria}` 
              : "Encontre os melhores profissionais para a sua obra."}
        </p>
      </div>

      <form method="GET" action="/profissionais" className="mb-8 flex flex-col md:flex-row gap-4 bg-neutral-surface p-4 rounded-lg shadow-sm border border-neutral-border">
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <Input 
          name="q" 
          defaultValue={q || ""}
          placeholder="Buscar por nome, especialidade ou descrição..."
        />
        <Button type="submit">Buscar</Button>
      </form>

      {profissionais.length === 0 ? (
        <div className="text-center py-20 bg-neutral-surface rounded-lg border border-neutral-border shadow-sm">
          <p className="text-neutral-muted text-lg mb-4">Nenhum profissional encontrado.</p>
          <Link 
            href="/profissionais" 
            className="inline-flex items-center justify-center min-h-11 px-4 py-3 bg-neutral-white border border-neutral-border rounded-lg text-neutral-text font-sans font-semibold leading-tight hover:bg-neutral-background transition-colors shadow-sm"
          >
            Limpar Filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Link
                key={profissional.id}
                href={`/profissionais/${profissional.id}`}
                className="block outline-none"
              >
                <Card
                  className="flex flex-col gap-4 min-h-[300px] cursor-pointer transition-all duration-150 ease-out bg-neutral-surface border-neutral-border shadow-sm hover:bg-neutral-background hover:border-brand-primary hover:shadow-md focus-within:bg-neutral-background focus-within:border-brand-primary focus-within:shadow-md h-full"
                >
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="flex flex-none items-center justify-center w-12 h-12 bg-brand-primary rounded-full text-neutral-white font-sans text-sm font-bold"
                    >
                      {initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h2 className="text-neutral-text font-sans text-lg font-semibold leading-tight m-0 truncate">
                        {profissional.user.name}
                      </h2>
                      <p className="text-brand-primary font-sans text-sm font-medium leading-normal mt-1 mb-0 truncate">
                        {profissional.servicos[0]?.titulo || "Profissional parceiro"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent text-base tracking-[0.04em] leading-tight">
                      {stars}
                    </span>
                    <span className="text-neutral-muted font-sans text-xs leading-normal">
                      {reviewsCount > 0 ? `${reviewsCount} avaliações` : "Novo"}
                    </span>
                  </div>

                  <p className="text-neutral-muted font-sans text-sm leading-normal flex-1 m-0 line-clamp-3">
                    {profissional.descricao || "Profissional disponível na plataforma."}
                  </p>

                  <div className="mt-auto pt-4 flex gap-2">
                    <Badge tone={profissional.ativo ? "success" : "neutral"}>
                      {profissional.ativo ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
