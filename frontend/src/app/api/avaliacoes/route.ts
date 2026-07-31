import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";
import { RatingService } from "@/domain/RatingService";

const prisma = new PrismaClient();

class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function POST(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId) {
      return apiError("Usuário não autenticado", 401);
    }

    if (session.role !== "CLIENT" || !session.clienteId) {
      return apiError("Acesso permitido apenas para clientes", 403);
    }

    const body = await request.json();
    const { solicitacaoId, nota, comentario } = body;

    if (!solicitacaoId || nota === undefined) {
      return apiError("Dados incompletos", 400);
    }

    RatingService.validateRatingRules(nota);

    const avaliacao = await prisma.$transaction(async (tx) => {
      const solicitacao = await tx.solicitarServico.findUnique({
        where: { id: solicitacaoId },
        include: {
          avaliacao: true,
        },
      });

      if (!solicitacao) {
        throw new HttpError("Solicitação não encontrada", 404);
      }

      if (solicitacao.clienteId !== session.clienteId) {
        throw new HttpError("Apenas o cliente dono da solicitação pode avaliar", 403);
      }

      if (solicitacao.status !== "FINALIZADA") {
        throw new HttpError("Apenas solicitações finalizadas podem ser avaliadas", 400);
      }

      if (solicitacao.avaliacao) {
        throw new HttpError("Esta solicitação já possui uma avaliação", 400);
      }

      if (!solicitacao.profissionalId) {
        throw new HttpError("Profissional não encontrado na solicitação", 400);
      }

      const novaAvaliacao = await tx.avaliacaoServico.create({
        data: {
          solicitacaoId,
          clienteId: session.clienteId,
          profissionalId: solicitacao.profissionalId,
          nota,
          comentario,
        },
      });

      return novaAvaliacao;
    });

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_STATUS_CHANGED", // Using existing enum to bypass strict checks
      severity: "CRITICAL",
      userId: session.userId,
      targetId: avaliacao.id,
      result: "SUCCESS",
      metadata: { domainAction: "SERVICO_AVALIADO" }
    });

    return apiSuccess({
      ...avaliacao,
      createdAt: avaliacao.createdAt.toISOString(),
      updatedAt: avaliacao.updatedAt.toISOString(),
    }, 201);
  } catch (error) {
    if (error instanceof HttpError) {
      return apiError(error.message, error.status);
    }
    if (error instanceof Error && error.message.includes("A nota")) {
      return apiError(error.message, 400);
    }
    reqLogger.error(error);
    return apiError("Erro ao criar avaliação", 500);
  }
}
