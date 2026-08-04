import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { ChatContainer } from "@/components/chat";
import { ProposalsSection } from "@/components/proposals";
import IniciarServicoButton from "@/components/solicitacao/IniciarServicoButton";
import { ServiceCompletionCard, CompletionTimeline } from "@/components/service-completion";
import { ReviewCard } from "@/components/reviews";
import { getAuthSession } from "@/lib/auth";
import type { HistoricoChat, MensagemChat } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";
import { Header, Footer } from "@/components/layout";

const prisma = new PrismaClient();

const statusLabels: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "Aberta",
  PROPOSTAS: "Propostas",
  NEGOCIACAO: "Negociação",
  ACEITA: "Aceita",
  EM_EXECUCAO: "Em execução",
  CONCLUIDA: "Concluída",
  AGUARDANDO_CONFIRMACAO: "Aguardando confirmação",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
  RECUSADA: "Recusada",
};

function mapMensagem(mensagem: {
  id: string;
  solicitacaoId: string;
  usuarioId: string | null;
  mensagem: string;
  createdAt: Date;
  autor: {
    id: string;
    name: string;
    role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
  } | null;
}): MensagemChat {
  return {
    id: mensagem.id,
    solicitacaoId: mensagem.solicitacaoId,
    usuarioId: mensagem.usuarioId,
    autor: mensagem.autor
      ? {
          id: mensagem.autor.id,
          nome: mensagem.autor.name,
          role: mensagem.autor.role,
        }
      : null,
    mensagem: mensagem.mensagem,
    createdAt: mensagem.createdAt.toISOString(),
  };
}

export default async function ProfissionalPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (
    session.role !== "PROFESSIONAL" ||
    !session.profissionalId
  ) {
    redirect("/profissional/pedidos");
  }

  const { id } = await params;
  const solicitacao = await prisma.solicitarServico.findUnique({
    where: {
      id,
    },
    include: {
      cliente: {
        include: {
          user: true,
        },
      },
      propostas: {
        include: {
          profissional: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      mensagens: {
        include: {
          autor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      avaliacao: true,
    },
  });

  if (
    !solicitacao ||
    solicitacao.profissionalId !== session.profissionalId
  ) {
    notFound();
  }

  const historico: HistoricoChat = {
    solicitacaoId: solicitacao.id,
    mensagens: solicitacao.mensagens.map(mapMensagem),
  };



  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      <main className="flex-1 w-full p-4 sm:p-10 max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold mb-6">
            Pedido de {solicitacao.cliente.user.name}
          </h1>

          <section className="border rounded-lg p-6 shadow bg-white">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Dados do cliente
                </h2>
                <p className="mb-2">
                  <strong>Nome:</strong>{" "}
                  {solicitacao.cliente.user.name}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong>{" "}
                  {solicitacao.cliente.user.email}
                </p>
                <p>
                  <strong>Telefone:</strong>{" "}
                  {solicitacao.cliente.user.phone ||
                    "Não informado"}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Dados da solicitação
                </h2>
                <p className="mb-2">
                  <strong>Título:</strong> {solicitacao.titulo}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  {statusLabels[solicitacao.status]}
                </p>
                <p>
                  <strong>Descrição:</strong>
                  <br />
                  {solicitacao.descricao}
                </p>
              </div>
            </div>
          </section>

          {solicitacao.status === "ACEITA" && (
            <div className="mt-6">
              <IniciarServicoButton solicitacaoId={solicitacao.id} />
            </div>
          )}

          <div className="mt-6">
            <CompletionTimeline status={solicitacao.status as SolicitacaoServicoStatus} />
          </div>

          <div className="mt-6">
            <ServiceCompletionCard 
              solicitacaoId={solicitacao.id} 
              status={solicitacao.status as SolicitacaoServicoStatus} 
              role="PROFESSIONAL" 
            />
          </div>

          {solicitacao.avaliacao && (
            <div className="mt-6 border rounded-lg p-6 shadow bg-white">
              <h2 className="text-xl font-semibold mb-4">Avaliação do Cliente</h2>
              <ReviewCard
                id={solicitacao.avaliacao.id}
                nota={solicitacao.avaliacao.nota}
                comentario={solicitacao.avaliacao.comentario}
                createdAt={solicitacao.avaliacao.createdAt.toISOString()}
                cliente={{
                  nome: solicitacao.cliente.user.name,
                }}
                solicitacao={{
                  titulo: solicitacao.titulo,
                }}
              />
            </div>
          )}

          <div className="mt-6">
            <ProposalsSection solicitacaoId={solicitacao.id} userRole="PROFESSIONAL" />
          </div>

          <div className="mt-8 h-[600px]">
            <ChatContainer
              historicoInicial={historico}
              solicitacaoId={solicitacao.id}
              usuarioAtualId={session.userId}
              title={solicitacao.cliente.user.name}
              subtitle="Cliente"
              status={solicitacao.status as SolicitacaoServicoStatus}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
