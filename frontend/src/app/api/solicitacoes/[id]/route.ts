import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";

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
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session) {
      return apiError("Usuário não autenticado", 401);
    }

    if (session.role !== "PROFESSIONAL") {
      return apiError("Acesso permitido apenas para profissionais", 403);
    }

    const payload = parsePayload(await request.json());

    if (!payload) {
      return apiError("Status inválido para solicitação", 400);
    }

    const { id } = await context.params;

    const solicitacao = await prisma.$transaction(async (tx) => {
      const current = await tx.solicitarServico.findUnique({
        where: { id },
      });

      if (!current) {
        throw new HttpError("Solicitação não encontrada", 404);
      }

      if (
        !session.profissionalId ||
        current.profissionalId !== session.profissionalId
      ) {
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

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_STATUS_CHANGED",
      severity: "CRITICAL",
      userId: session.userId,
      targetId: solicitacao.id,
      result: "SUCCESS",
      metadata: { status: solicitacao.status },
    });

    return apiSuccess(
      {
        ...solicitacao,
        createdAt: solicitacao.createdAt.toISOString(),
        startedAt: solicitacao.startedAt
          ? solicitacao.startedAt.toISOString()
          : null,
      }
    );
  } catch (error) {
    if (error instanceof HttpError) {
      audit.log(reqLogger, request, {
        action: "SOLICITACAO_STATUS_CHANGED",
        severity: "CRITICAL",
        result: "FAILURE",
        metadata: { reason: error.message },
      });
      return apiError(error.message, error.status);
    }

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_STATUS_CHANGED",
      severity: "CRITICAL",
      result: "FAILURE",
      metadata: { reason: "Internal Error" },
    });
    reqLogger.error(error);

    return apiError("Erro ao atualizar solicitação", 500);
  }
}
