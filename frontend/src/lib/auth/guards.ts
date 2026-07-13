import { NextResponse } from "next/server";
import type { AuthSession, AuthUserRole } from "@/types/auth";

export function hasRole(session: AuthSession | null, role: AuthUserRole) {
  return Boolean(session && session.role === role);
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

  if (authError) {
    return authError;
  }

  if (!hasRole(session, role)) {
    return NextResponse.json(
      { error: message },
      { status: 403 }
    );
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
  if (!session) {
    return false;
  }

  if (session.role === "CLIENT") {
    return Boolean(
      session.clienteId && solicitation.clienteId === session.clienteId
    );
  }

  if (session.role === "PROFESSIONAL") {
    return Boolean(
      session.profissionalId &&
        solicitation.profissionalId === session.profissionalId
    );
  }

  return false;
}

export function requireSolicitationOwnership(
  session: AuthSession | null,
  solicitation: SolicitationOwnershipTarget,
  message = "Acesso permitido apenas ao responsável pela solicitação"
) {
  const authError = requireAuth(session);

  if (authError) {
    return authError;
  }

  if (!hasSolicitationOwnership(session, solicitation)) {
    return NextResponse.json(
      { error: message },
      { status: 403 }
    );
  }

  return null;
}
