import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import type { AuthSession } from "@/types/auth";
import { logger } from "@/lib/logger";

import type {
  HistoricoChat,
  MensagemChat,
} from "@/types/chat";

type SolicitacaoParticipantes = {
  clienteId: string;
  profissionalId: string | null;
  status?: string;
};

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
      status: true,
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const reqLogger = logger.withRequest(_request);
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

    // Limite de segurança e estratégia de consulta dos registros mais recentes
    const limitParam = _request.nextUrl.searchParams.get("limit");
    const limit = limitParam
      ? Math.min(Math.max(parseInt(limitParam, 10) || 100, 1), 200)
      : 100;

    const totalCount = await prisma.mensagemSolicitacao.count({
      where: { solicitacaoId: id },
    });

    const skip = Math.max(0, totalCount - limit);

    const mensagens = await prisma.mensagemSolicitacao.findMany({
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
      skip,
      take: limit,
    });

    const historico: HistoricoChat = {
      solicitacaoId: id,
      mensagens: mensagens.map(mapMensagem),
    };

    return NextResponse.json(historico);
  } catch (error) {
    reqLogger.error(error);

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
  const reqLogger = logger.withRequest(request);
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
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown> | null;
    const textoMensagem =
      typeof payload?.mensagem === "string" ? payload.mensagem.trim() : "";

    if (!textoMensagem) {
      return NextResponse.json(
        { error: "A mensagem não pode ser vazia" },
        { status: 400 }
      );
    }

    if (textoMensagem.length > 5000) {
      return NextResponse.json(
        { error: "A mensagem excede o limite permitido de 5000 caracteres" },
        { status: 400 }
      );
    }

    // Proteção contra adulteração de ID de solicitação ou falsificação de remetente
    if (payload?.solicitacaoId && payload.solicitacaoId !== id) {
      return NextResponse.json(
        { error: "Payload inválido para esta solicitação" },
        { status: 400 }
      );
    }

    if (payload?.usuarioId && payload.usuarioId !== session.userId) {
      return NextResponse.json(
        { error: "Identidade do remetente incompatível com a sessão autenticada" },
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

    const isInactive =
      solicitacao.status === "CONCLUIDA" ||
      solicitacao.status === "FINALIZADA" ||
      solicitacao.status === "CANCELADA" ||
      solicitacao.status === "RECUSADA" ||
      solicitacao.status === "EXPIRADA";

    if (isInactive) {
      return NextResponse.json(
        { error: "Não é permitido enviar mensagens para uma solicitação inativa ou encerrada" },
        { status: 400 }
      );
    }

    // Persistência atômica: cria a mensagem associada ao usuário autenticado e atualiza o updatedAt da solicitação
    const [novaMensagem] = await prisma.$transaction([
      prisma.mensagemSolicitacao.create({
        data: {
          solicitacaoId: id,
          usuarioId: session.userId,
          mensagem: textoMensagem,
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
      }),
      prisma.solicitarServico.update({
        where: { id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return NextResponse.json(mapMensagem(novaMensagem), {
      status: 201,
    });
  } catch (error) {
    reqLogger.error(error);

    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}
