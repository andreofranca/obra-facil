import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import ChatMensagens from "@/components/chat/ChatMensagens";
import PropostaFormulario from "@/components/propostas/PropostaFormulario";
import IniciarServicoButton from "@/components/solicitacao/IniciarServicoButton";
import { PropostaResumo } from "@/types/proposta";
import PropostaItem from "@/components/propostas/PropostaItem";
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

  const propostasResumo: PropostaResumo[] = (solicitacao.propostas || []).map((p) => ({
    id: p.id,
    valor: p.valor.toString(),
    prazoDias: p.prazoDias,
    mensagem: p.mensagem,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    solicitacao: {
      id: solicitacao.id,
      titulo: solicitacao.titulo,
      descricao: solicitacao.descricao,
      cliente: {
        id: solicitacao.cliente.id,
        nome: solicitacao.cliente.user.name,
        email: solicitacao.cliente.user.email,
      },
    },
    profissional: {
      id: p.profissional.id,
      nome: p.profissional.user.name,
      email: p.profissional.user.email,
    },
  }));

  return (
    <main className="p-10">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">
          Pedido de {solicitacao.cliente.user.name}
        </h1>

        <section className="border rounded-lg p-6 shadow">
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
          <IniciarServicoButton solicitacaoId={solicitacao.id} />
        )}

        <PropostaFormulario
          solicitacaoId={solicitacao.id}
          profissionalId={session.profissionalId}
        />
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Propostas</h2>
          <div className="grid gap-3">
            {propostasResumo.map((p) => (
              <PropostaItem key={p.id} proposta={p} />
            ))}
          </div>
        </div>

        <ChatMensagens
          historicoInicial={historico}
          solicitacaoId={solicitacao.id}
          usuarioAtualId={session.userId}
        />
      </div>
    </main>
  );
}
