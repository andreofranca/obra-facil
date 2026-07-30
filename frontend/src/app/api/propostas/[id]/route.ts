import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";
import { ContractingDomainService } from "@/domain/marketplace/ContractingDomainService";
import { PaymentService } from "@/lib/payments/service";
import { MockPaymentProvider } from "@/lib/payments/providers/mock";

// Na arquitetura real, você pode usar um contêiner de Injeção de Dependências.
const paymentProvider = new MockPaymentProvider();
const paymentService = new PaymentService(paymentProvider);
const contractingService = new ContractingDomainService(paymentService);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.clienteId) {
      return apiError("Usuário não autenticado ou não é cliente", 401);
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

    if (session.role !== "CLIENT") {
      return apiError("Ação permitida apenas para o cliente", 403);
    }

    if (status === "ACEITA") {
      try {
        const acceptedProposal = await contractingService.acceptProposal(id, session.clienteId);
        
        audit.log(reqLogger, request, {
          action: "PROPOSTA_STATUS_CHANGED",
          severity: "CRITICAL",
          userId: session.userId,
          targetId: id,
          result: "SUCCESS",
          metadata: { status: "ACEITA" },
        });

        return apiSuccess(acceptedProposal);
      } catch (err: any) {
        audit.log(reqLogger, request, {
          action: "PROPOSTA_STATUS_CHANGED",
          severity: "CRITICAL",
          result: "FAILURE",
          metadata: { reason: err.message || String(err) },
        });
        reqLogger.error(err);
        return apiError(err.message || String(err), 400);
      }
    }

    // RECUSADA
    try {
      const rejectedProposal = await contractingService.rejectProposal(id, session.clienteId);
      
      audit.log(reqLogger, request, {
        action: "PROPOSTA_STATUS_CHANGED",
        severity: "CRITICAL",
        userId: session.userId,
        targetId: id,
        result: "SUCCESS",
        metadata: { status: "RECUSADA" },
      });

      return apiSuccess(rejectedProposal);
    } catch (err: any) {
       audit.log(reqLogger, request, {
        action: "PROPOSTA_STATUS_CHANGED",
        severity: "CRITICAL",
        result: "FAILURE",
        metadata: { reason: err.message || String(err) },
      });
      reqLogger.error(err);
      return apiError(err.message || String(err), 400);
    }

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
