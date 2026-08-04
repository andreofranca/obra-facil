import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { OrdersList } from "@/components/pedidos";
import { Card } from "@/components/ui/Card";
import type { SolicitacaoServicoResumo } from "@/types/solicitacao";
import { Header, Footer } from "@/components/layout";

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
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      
      <main className="flex-1 w-full p-4 sm:p-10 max-w-7xl mx-auto">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-brand-primary/5 border-brand-primary/20">
            <h3 className="text-sm font-semibold text-neutral-dark mb-1">Serviços Ativos</h3>
            <p className="text-3xl font-bold text-brand-primary">
              {solicitacoes.filter(s => s.status === "EM_EXECUCAO" || s.status === "ACEITA").length}
            </p>
            <p className="text-xs text-neutral-text mt-2">Em andamento</p>
          </Card>
          <Card className="p-6 bg-warning-light/20 border-warning-light/50">
            <h3 className="text-sm font-semibold text-neutral-dark mb-1">Aguardando Aprovação</h3>
            <p className="text-3xl font-bold text-warning-dark">
              {solicitacoes.filter(s => s.status === "AGUARDANDO_CONFIRMACAO").length}
            </p>
            <p className="text-xs text-neutral-text mt-2">Requer sua ação</p>
          </Card>
          <Card className="p-6 bg-success-light/20 border-success-light/50">
            <h3 className="text-sm font-semibold text-neutral-dark mb-1">Finalizados</h3>
            <p className="text-3xl font-bold text-success-dark">
              {solicitacoes.filter(s => s.status === "FINALIZADA").length}
            </p>
            <p className="text-xs text-neutral-text mt-2">Trabalhos concluídos</p>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-text mb-2">
              Meus Pedidos
            </h1>
            <p className="text-neutral-text/70 max-w-2xl">
              Acompanhe o andamento das suas solicitações de serviço. Bem-vindo de volta, <strong>{session.name}</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Link href="/meus-favoritos" tabIndex={-1} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                  </svg>
                  Favoritos
                </span>
              </Button>
            </Link>
            <Link href="/minhas-propostas" tabIndex={-1} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Ver propostas
              </Button>
            </Link>
            <Link href="/profissionais" tabIndex={-1} className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">
                Novo Pedido
              </Button>
            </Link>
          </div>
        </div>

        <OrdersList solicitacoes={solicitacoes} />
      </main>

      <Footer />
    </div>
  );
}
