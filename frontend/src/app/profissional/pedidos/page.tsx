import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfissionalPedidosClient from "@/components/profissional/ProfissionalPedidosClient";
import { getAuthSession } from "@/lib/auth";
import type { SolicitacaoProfissionalResumo } from "@/types/solicitacao";
import { PrismaClient } from "@prisma/client";
import { Header, Footer } from "@/components/layout";

const prisma = new PrismaClient();

async function getSolicitacoesProfissional(): Promise<{
  solicitacoes: SolicitacaoProfissionalResumo[];
  errorMessage: string;
}> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(
    "http://localhost:3000/api/profissional/solicitacoes",
    {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) {
    return {
      solicitacoes: [],
      errorMessage:
        "Não foi possível carregar as solicitações do profissional.",
    };
  }

  return {
    solicitacoes:
      (await response.json()) as SolicitacaoProfissionalResumo[],
    errorMessage: "",
  };
}

export default async function ProfissionalPedidosPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "PROFESSIONAL" || !session.profissionalId) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
        <Header />
        <main className="flex-1 w-full p-4 sm:p-10 max-w-7xl mx-auto">
          <div className="max-w-3xl border rounded-lg p-6 shadow">
            <h1 className="text-3xl font-bold mb-4">
              Painel do Profissional
            </h1>
            <p>
              Esta área está disponível apenas para usuários
              profissionais.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { solicitacoes, errorMessage } =
    await getSolicitacoesProfissional();
    
  const summary = await import("@/domain/RatingService").then(mod => mod.RatingService.getProfissionalReputation(session.profissionalId!));

  // Estimativa de receita:
  const revenueData = await prisma.proposta.aggregate({
    _sum: {
      valor: true,
    },
    where: {
      profissionalId: session.profissionalId,
      status: "ACEITA",
    },
  });
  
  const estimatedRevenue = revenueData._sum.valor ? Number(revenueData._sum.valor) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      <main className="flex-1 w-full bg-neutral-background pt-4">
        <ProfissionalPedidosClient
          initialSolicitacoes={solicitacoes}
          initialErrorMessage={errorMessage}
          profissionalNome={session.name || "Profissional"}
          summary={summary}
          revenue={estimatedRevenue}
        />
      </main>
      <Footer />
    </div>
  );
}
