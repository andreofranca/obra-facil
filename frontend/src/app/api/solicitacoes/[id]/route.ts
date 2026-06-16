import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import type {
  AtualizarSolicitacaoStatusPayload,
  SolicitacaoServicoStatus,
} from "@/types/solicitacao";

const prisma = new PrismaClient();

const allowedStatus: SolicitacaoServicoStatus[] = [
  "ABERTA",
  "EM_ANALISE",
  "ACEITA",
  "EM_ANDAMENTO",
  "CONCLUIDA",
];

function isAllowedStatus(
  status: unknown
): status is AtualizarSolicitacaoStatusPayload["status"] {
  return (
    typeof status === "string" &&
    allowedStatus.includes(status as SolicitacaoServicoStatus)
  );
}

function parsePayload(
  body: unknown
): AtualizarSolicitacaoStatusPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (!isAllowedStatus(payload.status)) {
    return null;
  }

  return {
    status: payload.status,
  };
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    if (
      session.role !== "PROFESSIONAL" ||
      !session.profissionalId
    ) {
      return NextResponse.json(
        { error: "Acesso permitido apenas para profissionais" },
        { status: 403 }
      );
    }

    const payload = parsePayload(await request.json());

    if (!payload) {
      return NextResponse.json(
        { error: "Status inválido para solicitação" },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    const solicitacao =
      await prisma.solicitarServico.update({
        where: {
          id,
        },
        data: {
          status: payload.status,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          titulo: true,
          descricao: true,
          status: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      ...solicitacao,
      createdAt: solicitacao.createdAt.toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar solicitação" },
      { status: 500 }
    );
  }
}
