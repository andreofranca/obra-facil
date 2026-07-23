import { NextRequest } from "next/server";
import { logger } from "./logger";

export type AuditAction = 
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_REGISTER"
  | "SOLICITACAO_CREATED"
  | "SOLICITACAO_STATUS_CHANGED"
  | "PROPOSTA_CREATED"
  | "PROPOSTA_STATUS_CHANGED";

export type AuditSeverity = "CRITICAL" | "IMPORTANT" | "INFO";

export interface AuditPayload {
  action: AuditAction;
  severity: AuditSeverity;
  userId?: string;
  targetId?: string; // ID of the created/modified entity (solicitacaoId, propostaId, etc)
  result: "SUCCESS" | "FAILURE";
  metadata?: Record<string, unknown>;
}

export const audit = {
  /**
   * Logs a business audit event using the technical logger infrastructure.
   */
  log: (
    reqLogger: ReturnType<typeof logger.withRequest>,
    request: NextRequest,
    payload: AuditPayload
  ) => {
    // Only CRITICAL events are implemented in this sprint phase per CTO orders.
    if (payload.severity === "CRITICAL") {
      const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
        
      const userAgent = request.headers.get("user-agent") || "unknown";

      const logPayload = {
        audit: {
          action: payload.action,
          severity: payload.severity,
          userId: payload.userId,
          targetId: payload.targetId,
          result: payload.result,
          ip,
          userAgent,
          metadata: payload.metadata,
        },
      };

      if (payload.result === "FAILURE") {
        reqLogger.warn(`Audit: ${payload.action} [${payload.result}]`, logPayload);
      } else {
        reqLogger.info(`Audit: ${payload.action} [${payload.result}]`, logPayload);
      }
    }
  },
};
