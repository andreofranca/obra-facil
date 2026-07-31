import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";

const prisma = new PrismaClient();

class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId) {
      return apiError("Usuário não autenticado", 401);
    }

    if (session.role !== "PROFESSIONAL") {
      return apiError("Acesso permitido apenas para profissionais", 403);
    }

    const { id } = await context.params;

    const solicitacao = await prisma.$transaction(async (tx) => {
      const current = await tx.solicitarServico.findUnique({
        where: { id },
      });

      if (!current) {
        throw new HttpError("Solicitação não encontrada", 404);
      }

      if (!session.profissionalId || current.profissionalId !== session.profissionalId) {
        throw new HttpError("Ação permitida apenas para o profissional contratado", 403);
      }

      if (current.status !== "ACEITA") {
        throw new HttpError("A solicitação deve estar ACEITA para ser iniciada", 400);
      }

      const updated = await tx.solicitarServico.update({
        where: { id },
        data: {
          status: "EM_EXECUCAO",
          updatedAt: new Date(),
          startedAt: new Date(),
          historicoStatus: {
            create: {
              usuarioId: session.userId,
              statusAnterior: current.status,
              novoStatus: "EM_EXECUCAO",
            }
          }
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

      return updated;
    });

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_STATUS_CHANGED",
      severity: "INFO",
      userId: session.userId,
      targetId: solicitacao.id,
      result: "SUCCESS",
    });

    return apiSuccess({
      ...solicitacao,
      createdAt: solicitacao.createdAt.toISOString(),
      startedAt: solicitacao.startedAt ? solicitacao.startedAt.toISOString() : null,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return apiError(error.message, error.status);
    }
    reqLogger.error(error);
    return apiError("Erro ao iniciar solicitação", 500);
  }
}
