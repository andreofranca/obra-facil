import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { OrdersList } from "@/components/pedidos";
import type { SolicitacaoServicoResumo } from "@/types/solicitacao";

async function getSolicitacoes(): Promise<SolicitacaoServicoResumo[]> {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.clienteId) {
    return [];
  }

  const response = await fetch(
    `http://localhost:3000/api/solicitacoes?clienteId=${session.clienteId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function MeusPedidosPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const solicitacoes = await getSolicitacoes();

  return (
    <main className="p-4 sm:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-text mb-2">
            Meus Pedidos
          </h1>
          <p className="text-neutral-text/70 max-w-2xl">
            Acompanhe o andamento das suas solicitações de serviço. Bem-vindo de volta, <strong>{session.name}</strong>.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/minhas-propostas" tabIndex={-1} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver propostas
            </Button>
          </Link>
          <Link href="/solicitar-servico" tabIndex={-1} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">
              Novo Pedido
            </Button>
          </Link>
        </div>
      </div>

      <OrdersList solicitacoes={solicitacoes} />
    </main>
  );
}
