import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import ChatMensagens from "@/components/chat/ChatMensagens";
import { getAuthSession } from "@/lib/auth";
import type { HistoricoChat, MensagemChat } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

const prisma = new PrismaClient();

const statusLabels: Record<SolicitacaoServicoStatus, string> = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em análise",
  ACEITA: "Aceita",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
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

  return (
    <main className="p-10">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">
          {solicitacao.titulo}
        </h1>

        <section className="border rounded-lg p-6 shadow">
          <p className="mb-4">
            <strong>Descrição:</strong>
            <br />
            {solicitacao.descricao}
          </p>

          <p className="mb-4">
            <strong>Status:</strong>
            <br />
            {statusLabels[solicitacao.status]}
          </p>

          <p>
            <strong>Profissional vinculado:</strong>
            <br />
            {solicitacao.profissional?.user.name ||
              "Ainda não definido"}
          </p>
        </section>

        <ChatMensagens
          historicoInicial={historico}
          solicitacaoId={solicitacao.id}
          usuarioAtualId={session.userId}
        />
      </div>
    </main>
  );
}
