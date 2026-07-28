import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, logger } from "@/platform/observability";
import { Principal } from "../authorization";

// O middleware base suporta receber uma funcao validadora
export type SecurityContext = {
  // Can be cast by the application layer based on its Principal structure
  principal: Principal | null; 
};

export type AuthHandler = (req: NextRequest, ctx: SecurityContext, ...args: unknown[]) => Promise<NextResponse> | NextResponse;

export interface IAuthMiddlewareProvider {
  extractPrincipal(req: NextRequest): Promise<Principal | null>;
}

export function createWithAuth(provider: IAuthMiddlewareProvider) {
  return function withAuth(handler: AuthHandler, options?: { requireAuth?: boolean }) {
    return async (req: NextRequest, ...args: unknown[]) => {
      const principal = await provider.extractPrincipal(req);

      if (options?.requireAuth && !principal) {
        logger.warn("Tentativa de acesso não autenticado bloqueada pelo withAuth", {
          action: "ACCESS_DENIED",
          reason: "UNAUTHENTICATED",
          path: req.nextUrl.pathname,
        });
        throw new UnauthorizedError("Acesso restrito. Autenticação necessária.");
      }

      if (principal) {
        logger.debug("Acesso autenticado autorizado no withAuth", {
          action: "ACCESS_GRANTED",
          principalId: principal.id,
          role: principal.role,
        });
      }

      return handler(req, { principal }, ...args);
    };
  };
}
