async function getCategorias() {
  const response = await fetch(
    "http://localhost:3000/api/categorias",
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function Home() {
  const categorias = await getCategorias();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Obra Fácil
      </h1>

      <h2 className="text-xl mb-4">
        Categorias Disponíveis
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map((categoria: any) => (
          <div
            key={categoria.id}
            className="border rounded-lg p-4 shadow"
          >
            {categoria.nome}
          </div>
        ))}
      </div>
    </main>
  );
}