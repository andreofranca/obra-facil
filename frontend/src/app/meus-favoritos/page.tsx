import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/Button";

const prisma = new PrismaClient();

export default async function MeusFavoritosPage() {
  const session = await getAuthSession();

  if (!session || !session.clienteId) {
    redirect("/login");
  }

  const favoritos = await prisma.favorito.findMany({
    where: { clienteId: session.clienteId },
    include: {
      profissional: {
        include: {
          user: true,
          servicos: {
            include: { categoria: true },
            take: 1
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text mb-2">Meus Favoritos</h1>
            <p className="text-neutral-text/70">Profissionais que você salvou para contatar futuramente.</p>
          </div>
          <Link href="/meus-pedidos">
            <Button variant="outline">Voltar para meus pedidos</Button>
          </Link>
        </div>

        {favoritos.length === 0 ? (
          <div className="bg-white/50 border border-neutral-border p-12 text-center rounded-xl">
            <p className="text-neutral-text/70">Você ainda não tem profissionais favoritos.</p>
            <Link href="/" className="inline-block mt-4">
              <Button variant="primary">Buscar Profissionais</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((fav) => {
              const prof = fav.profissional;
              const especialidade = prof.servicos[0]?.categoria.nome || "Profissional";
              return (
                <div key={fav.id} className="bg-white border border-neutral-border p-6 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-neutral-dark">{prof.user.name}</h3>
                    <p className="text-sm text-neutral-text/70 mb-4">{especialidade}</p>
                    {prof.descricao && (
                      <p className="text-sm text-neutral-text line-clamp-2 mb-4">{prof.descricao}</p>
                    )}
                  </div>
                  <Link href={`/profissionais/${prof.id}`} className="w-full">
                    <Button variant="outline" className="w-full">Ver Perfil</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
