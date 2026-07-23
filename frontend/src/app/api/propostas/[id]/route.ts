import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";


const prisma = new PrismaClient();

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

    const { id } = await context.params;

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return apiError("Payload inválido", 400);
    }

    const status = body.status as "ACEITA" | "RECUSADA" | undefined;

    if (status !== "ACEITA" && status !== "RECUSADA") {
      return apiError("Status inválido", 400);
    }

    const proposta = await prisma.proposta.findUnique({ where: { id } });

    if (!proposta) {
      return apiError("Proposta não encontrada", 404);
    }

    const solicitacao = await prisma.solicitarServico.findUnique({ where: { id: proposta.solicitacaoId } });

    if (!solicitacao) {
      return apiError("Solicitação não encontrada", 404);
    }

    if (session.role !== "CLIENT") {
      return apiError(
        "Ação permitida apenas para o cliente proprietário",
        403
      );
    }

    if (!session.clienteId || session.clienteId !== solicitacao.clienteId) {
      return apiError(
        "Ação permitida apenas para o cliente proprietário",
        403
      );
    }

    if (status === "ACEITA") {
      if (proposta.status === "ACEITA") {
        return apiError("Proposta já aceita", 400);
      }

      try {
        await prisma.$transaction(async (tx) => {
          const alreadyAccepted = await tx.proposta.findFirst({
            where: { solicitacaoId: proposta.solicitacaoId, status: "ACEITA" },
          });

          if (alreadyAccepted) {
            throw new Error("Já existe uma proposta aceita para esta solicitação");
          }

          await tx.proposta.update({
            where: { id },
            data: { status: "ACEITA", updatedAt: new Date() },
          });

          await tx.proposta.updateMany({
            where: { solicitacaoId: proposta.solicitacaoId, id: { not: id } },
            data: { status: "RECUSADA", updatedAt: new Date() },
          });

          await tx.solicitarServico.update({
            where: { id: proposta.solicitacaoId },
            data: { status: "EM_ANDAMENTO", updatedAt: new Date() },
          });
        });
      } catch (err) {
        audit.log(reqLogger, request, {
          action: "PROPOSTA_STATUS_CHANGED",
          severity: "CRITICAL",
          result: "FAILURE",
          metadata: { reason: String(err) },
        });
        reqLogger.error(err);
        return apiError(String(err), 400);
      }

      const updated = await prisma.proposta.findUnique({ where: { id } });

      audit.log(reqLogger, request, {
        action: "PROPOSTA_STATUS_CHANGED",
        severity: "CRITICAL",
        userId: session.userId,
        targetId: id,
        result: "SUCCESS",
        metadata: { status: "ACEITA" },
      });

      return apiSuccess(updated);
    }

    // RECUSADA
    if (proposta.status === "ACEITA") {
      return apiError("Proposta aceita não pode ser modificada", 400);
    }

    const recusada = await prisma.proposta.update({
      where: { id },
      data: { status: "RECUSADA", updatedAt: new Date() },
    });

    audit.log(reqLogger, request, {
      action: "PROPOSTA_STATUS_CHANGED",
      severity: "CRITICAL",
      userId: session.userId,
      targetId: id,
      result: "SUCCESS",
      metadata: { status: "RECUSADA" },
    });

    return apiSuccess(recusada);
  } catch (error) {
    audit.log(reqLogger, request, {
      action: "PROPOSTA_STATUS_CHANGED",
      severity: "CRITICAL",
      result: "FAILURE",
      metadata: { reason: "Internal Error" },
    });
    reqLogger.error(error);
    return apiError("Erro ao processar a solicitação", 500);
  }
}
