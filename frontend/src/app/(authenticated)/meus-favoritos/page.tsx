import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
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
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 font-sans text-slate-200">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meus Favoritos</h1>
          <p className="text-slate-400 text-lg">Profissionais que você salvou para contatar futuramente.</p>
        </div>
      </div>

      {favoritos.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-12 text-center rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <p className="text-slate-400 mb-6 text-lg">Você ainda não tem profissionais favoritos.</p>
          <Link href="/profissionais" className="inline-block">
            <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white border-transparent">Explorar Catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((fav) => {
            const prof = fav.profissional;
            const especialidade = prof.servicos[0]?.categoria.nome || "Profissional";
            return (
              <div key={fav.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div>
                  <h3 className="font-bold text-lg text-white">{prof.user.name}</h3>
                  <p className="text-sm text-indigo-400 font-medium mb-4">{especialidade}</p>
                  {prof.descricao && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{prof.descricao}</p>
                  )}
                </div>
                <Link href={`/profissionais/${prof.id}`} className="w-full mt-4">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Ver Perfil</Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
