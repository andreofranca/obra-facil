import { NextResponse } from "next/server";
import type { AuthSession, AuthUserRole } from "@/types/auth";
import { PolicyAuthorizationService, Principal, Action } from "@/platform/security";

const authService = new PolicyAuthorizationService();

function toPrincipal(session: AuthSession | null): Principal | null {
  if (!session) return null;
  return {
    id: session.userId, // We can define 'id' as the main subject ID
    role: session.role,
    // Add additional IDs to the principal for ownership matching
    clienteId: session.clienteId,
    profissionalId: session.profissionalId
  };
}

export function hasRole(session: AuthSession | null, role: AuthUserRole) {
  return authService.hasRole(toPrincipal(session), role);
}

export function requireAuth(session: AuthSession | null) {
  if (!session) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }
  return null;
}

export function requireRole(
  session: AuthSession | null,
  role: AuthUserRole,
  message = "Acesso não permitido para este perfil"
) {
  const authError = requireAuth(session);
  if (authError) return authError;

  if (!hasRole(session, role)) {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  return null;
}

export function requireProfessional(
  session: AuthSession | null,
  message = "Acesso não permitido para este perfil"
) {
  return requireRole(session, "PROFESSIONAL", message);
}

export function requireClient(
  session: AuthSession | null,
  message = "Acesso não permitido para este perfil"
) {
  return requireRole(session, "CLIENT", message);
}

type SolicitationOwnershipTarget = {
  clienteId: string | null;
  profissionalId: string | null;
};

export function hasSolicitationOwnership(
  session: AuthSession | null,
  solicitation: SolicitationOwnershipTarget
) {
  if (!session) return false;
  
  // Create resource representations to check ownership using generic RBAC/ABAC
  const clientAction: Action = { name: "access" };
  const professionalAction: Action = { name: "access" };
  
  const principal = toPrincipal(session);

  if (session.role === "CLIENT" && solicitation.clienteId) {
    return authService.canAccess(principal, clientAction, { type: "solicitation", ownerId: solicitation.clienteId });
  }

  if (session.role === "PROFESSIONAL" && solicitation.profissionalId) {
    return authService.canAccess(principal, professionalAction, { type: "solicitation", ownerId: solicitation.profissionalId });
  }

  return false;
}

export function requireSolicitationOwnership(
  session: AuthSession | null,
  solicitation: SolicitationOwnershipTarget,
  message = "Acesso permitido apenas ao responsável pela solicitação"
) {
  const authError = requireAuth(session);
  if (authError) return authError;

  if (!hasSolicitationOwnership(session, solicitation)) {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  return null;
}
