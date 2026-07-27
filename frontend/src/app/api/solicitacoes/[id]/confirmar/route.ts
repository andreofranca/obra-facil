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

    if (session.role !== "CLIENT") {
      return apiError("Acesso permitido apenas para clientes", 403);
    }

    const { id } = await context.params;

    const solicitacao = await prisma.$transaction(async (tx) => {
      const current = await tx.solicitarServico.findUnique({
        where: { id },
      });

      if (!current) {
        throw new HttpError("Solicitação não encontrada", 404);
      }

      // Check if it belongs to this client
      if (!session.clienteId || current.clienteId !== session.clienteId) {
        throw new HttpError("Ação permitida apenas para o cliente dono da solicitação", 403);
      }

      if (current.status !== "AGUARDANDO_CONFIRMACAO_CLIENTE") {
        throw new HttpError("A solicitação deve estar aguardando confirmação para ser concluída", 400);
      }

      const updated = await tx.solicitarServico.update({
        where: { id },
        data: {
          status: "CONCLUIDA",
          updatedAt: new Date(),
          finishedAt: new Date(),
          historicoStatus: {
            create: {
              usuarioId: session.userId,
              statusAnterior: current.status,
              novoStatus: "CONCLUIDA",
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
          finishedAt: true,
        },
      });

      return updated;
    });

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_STATUS_CHANGED",
      severity: "CRITICAL",
      userId: session.userId,
      targetId: solicitacao.id,
      result: "SUCCESS",
    });

    return apiSuccess({
      ...solicitacao,
      createdAt: solicitacao.createdAt.toISOString(),
      startedAt: solicitacao.startedAt ? solicitacao.startedAt.toISOString() : null,
      finishedAt: solicitacao.finishedAt ? solicitacao.finishedAt.toISOString() : null,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return apiError(error.message, error.status);
    }
    reqLogger.error(error);
    return apiError("Erro ao confirmar conclusão da solicitação", 500);
  }
}
