async function getProfissionais(categoria?: string) {
  const url = categoria
    ? `http://localhost:3000/api/profissionais?categoria=${categoria}`
    : "http://localhost:3000/api/profissionais";

  const response = await fetch(url, {
    cache: "no-store",
  });

  return response.json();
}

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;

const profissionais = await getProfissionais(
  params.categoria
);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Profissionais
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profissionais.map((profissional: any) => (
          <div
            key={profissional.id}
            className="border rounded-lg p-4 shadow"
          >
            <h2 className="text-xl font-semibold">
              {profissional.user.name}
            </h2>

            <p className="mt-2">
              {profissional.descricao}
            </p>

            <p className="mt-2">
              Experiência: {profissional.experiencia} anos
            </p>

            <p className="mt-2 text-sm opacity-80">
              Serviço:
              {" "}
              {profissional.servicos?.[0]?.titulo}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}