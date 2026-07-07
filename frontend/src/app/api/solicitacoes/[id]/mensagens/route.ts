import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import type { AuthSession } from "@/types/auth";
import type {
  HistoricoChat,
  MensagemChat,
  PayloadCriacaoMensagem,
} from "@/types/chat";

const prisma = new PrismaClient();

type SolicitacaoParticipantes = {
  clienteId: string;
  profissionalId: string | null;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePayload(
  body: unknown
): PayloadCriacaoMensagem | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.solicitacaoId) ||
    !isNonEmptyString(payload.usuarioId) ||
    !isNonEmptyString(payload.mensagem)
  ) {
    return null;
  }

  return {
    solicitacaoId: payload.solicitacaoId.trim(),
    usuarioId: payload.usuarioId.trim(),
    mensagem: payload.mensagem.trim(),
  };
}

function canAccessSolicitacao(
  session: AuthSession,
  solicitacao: SolicitacaoParticipantes
) {
  if (
    session.role === "CLIENT" &&
    session.clienteId === solicitacao.clienteId
  ) {
    return true;
  }

  return (
    session.role === "PROFESSIONAL" &&
    session.profissionalId === solicitacao.profissionalId
  );
}

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

async function getSolicitacao(id: string) {
  return prisma.solicitarServico.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      clienteId: true,
      profissionalId: true,
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const authError = requireAuth(session);

    if (authError) {
      return authError;
    }

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const solicitacao = await getSolicitacao(id);

    if (!solicitacao) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    if (!canAccessSolicitacao(session, solicitacao)) {
      return NextResponse.json(
        { error: "Acesso não permitido para esta solicitação" },
        { status: 403 }
      );
    }

    const mensagens =
      await prisma.mensagemSolicitacao.findMany({
        where: {
          solicitacaoId: id,
        },
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
      });

    const historico: HistoricoChat = {
      solicitacaoId: id,
      mensagens: mensagens.map(mapMensagem),
    };

    return NextResponse.json(historico);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar mensagens da solicitação" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const authError = requireAuth(session);

    if (authError) {
      return authError;
    }

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const payload = parsePayload(await request.json());

    if (!payload) {
      return NextResponse.json(
        {
          error:
            "Informe solicitacaoId, usuarioId e mensagem para enviar",
        },
        { status: 400 }
      );
    }

    if (
      payload.solicitacaoId !== id ||
      payload.usuarioId !== session.userId
    ) {
      return NextResponse.json(
        { error: "Payload inválido para esta solicitação" },
        { status: 400 }
      );
    }

    const solicitacao = await getSolicitacao(id);

    if (!solicitacao) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    if (!canAccessSolicitacao(session, solicitacao)) {
      return NextResponse.json(
        { error: "Acesso não permitido para esta solicitação" },
        { status: 403 }
      );
    }

    const mensagem =
      await prisma.mensagemSolicitacao.create({
        data: {
          solicitacaoId: id,
          usuarioId: payload.usuarioId,
          mensagem: payload.mensagem,
        },
        include: {
          autor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

    return NextResponse.json(mapMensagem(mensagem), {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}
