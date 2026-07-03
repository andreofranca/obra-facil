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

class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
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

    const solicitacao = await prisma.$transaction(async (tx) => {
      const current = await tx.solicitarServico.findUnique({
        where: { id },
      });

      if (!current) {
        throw new HttpError("Solicitação não encontrada", 404);
      }

      if (current.profissionalId !== session.profissionalId) {
        throw new HttpError(
          "Ação permitida apenas para o profissional contratado",
          403
        );
      }

      if (payload.status === "EM_ANDAMENTO") {
        if (current.status !== "ACEITA") {
          throw new HttpError(
            "A solicitação deve estar ACEITA para iniciar o serviço",
            400
          );
        }

        return tx.solicitarServico.update({
          where: { id },
          data: {
            status: "EM_ANDAMENTO",
            startedAt: new Date(),
            updatedAt: new Date(),
          },
          select: {
            id: true,
            titulo: true,
            descricao: true,
            status: true,
            startedAt: true,
            createdAt: true,
          },
        });
      }

      return tx.solicitarServico.update({
        where: { id },
        data: {
          status: payload.status,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          titulo: true,
          descricao: true,
          status: true,
          startedAt: true,
          createdAt: true,
        },
      });
    });

    return NextResponse.json({
      ...solicitacao,
      createdAt: solicitacao.createdAt.toISOString(),
      startedAt: solicitacao.startedAt
        ? solicitacao.startedAt.toISOString()
        : null,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar solicitação" },
      { status: 500 }
    );
  }
}
