import { NextRequest } from "next/server";
import { createWithAuth, IAuthMiddlewareProvider } from "@/platform/security";
import { getAuthSession } from "./session";
import { Principal } from "@/platform/security";

class AuthMiddlewareProvider implements IAuthMiddlewareProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async extractPrincipal(_req: NextRequest): Promise<Principal | null> {
    const session = await getAuthSession();
    if (!session) return null;
    
    return {
      id: session.userId,
      role: session.role,
      clienteId: session.clienteId,
      profissionalId: session.profissionalId,
    };
  }
}

export const withAuth = createWithAuth(new AuthMiddlewareProvider());
