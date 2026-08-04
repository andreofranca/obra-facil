import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChatContainer } from "@/components/chat";
import { getAuthSession } from "@/lib/auth";
import { OrderTimeline, OrderStatusBadge } from "@/components/pedidos";
import { ServiceCompletionCard, CompletionTimeline } from "@/components/service-completion";
import { Card } from "@/components/ui/Card";
import { ProposalsSection } from "@/components/proposals";
import { ReviewForm, ReviewCard } from "@/components/reviews";
import type { HistoricoChat, MensagemChat } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";
import { Header, Footer } from "@/components/layout";

const prisma = new PrismaClient();

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

export default async function MinhaSolicitacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CLIENT" || !session.clienteId) {
    redirect("/meus-pedidos");
  }

  const { id } = await params;
  const solicitacao = await prisma.solicitarServico.findUnique({
    where: {
      id,
    },
    include: {
      profissional: {
        include: {
          user: true,
        },
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
    solicitacao.clienteId !== session.clienteId
  ) {
    notFound();
  }

  const historico: HistoricoChat = {
    solicitacaoId: solicitacao.id,
    mensagens: solicitacao.mensagens.map(mapMensagem),
  };

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(solicitacao.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      <main className="flex-1 w-full p-4 sm:p-10 max-w-5xl mx-auto flex flex-col gap-8">
        <div>
          <Link href="/meus-pedidos" className="inline-flex items-center text-sm font-medium text-brand-primary hover:underline mb-6" tabIndex={-1}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Voltar para meus pedidos
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-text">
                {solicitacao.titulo}
              </h1>
              <p className="text-neutral-text/70 mt-1">
                Solicitado em {dataFormatada}
              </p>
            </div>
            <div>
              <OrderStatusBadge status={solicitacao.status as SolicitacaoServicoStatus} />
            </div>
          </div>
        </div>

        <Card className="p-6 bg-white/50 backdrop-blur-sm border-neutral-border/60">
          <h2 className="text-lg font-bold text-neutral-text mb-4">Acompanhamento</h2>
          <OrderTimeline status={solicitacao.status as SolicitacaoServicoStatus} />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 flex flex-col gap-6">
            <Card className="p-5 bg-white/50 backdrop-blur-sm border-neutral-border/60">
              <h2 className="text-base font-bold text-neutral-text mb-3">Detalhes</h2>
              <p className="text-sm text-neutral-text/80 leading-relaxed mb-4">
                {solicitacao.descricao}
              </p>
              <div className="pt-4 border-t border-neutral-border/40">
                <h3 className="text-xs font-semibold text-neutral-text/70 uppercase tracking-wider mb-1">Profissional</h3>
                <p className="text-sm font-medium text-neutral-text">
                  {solicitacao.profissional?.user.name || "Ainda não definido"}
                </p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <Card className="p-5 bg-white border-neutral-border shadow-sm">
              <ProposalsSection solicitacaoId={solicitacao.id} userRole="CLIENT" />
            </Card>
            
            <CompletionTimeline status={solicitacao.status as SolicitacaoServicoStatus} />
            <ServiceCompletionCard 
              solicitacaoId={solicitacao.id} 
              status={solicitacao.status as SolicitacaoServicoStatus} 
              role="CLIENT" 
            />
            
            {solicitacao.status === "FINALIZADA" && (
              <div className="mt-4">
                {solicitacao.avaliacao ? (
                  <Card className="p-6 bg-white border-neutral-border shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-text mb-4">Sua Avaliação</h3>
                    <ReviewCard
                      id={solicitacao.avaliacao.id}
                      nota={solicitacao.avaliacao.nota}
                      comentario={solicitacao.avaliacao.comentario}
                      createdAt={solicitacao.avaliacao.createdAt.toISOString()}
                      cliente={{
                        nome: session.name || "Você",
                      }}
                      solicitacao={{
                        titulo: solicitacao.titulo,
                      }}
                    />
                  </Card>
                ) : (
                  <ReviewForm solicitacaoId={solicitacao.id} />
                )}
              </div>
            )}

            <div className="h-[500px]">
              <ChatContainer
                solicitacaoId={solicitacao.id}
                usuarioAtualId={session.userId}
                historicoInicial={historico}
                title={solicitacao.profissional?.user.name || "Profissional"}
                subtitle="Profissional"
                status={solicitacao.status as SolicitacaoServicoStatus}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
