import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createSessionCookieValue,
  getSessionCookieName,
  verifyPassword,
} from "@/lib/auth";
import type {
  AuthErrorResponse,
  AuthResponse,
  LoginPayload,
} from "@/types/auth";
import { audit } from "@/lib/audit";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseLoginPayload(body: unknown): LoginPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.email) ||
    !isNonEmptyString(payload.password)
  ) {
    return null;
  }

  return {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  };
}

export async function POST(request: NextRequest) {
  const payload = parseLoginPayload(await request.json());

  if (!payload) {
    return NextResponse.json<AuthErrorResponse>(
      { error: "Informe email e senha" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      cliente: {
        select: { id: true },
      },
      profissional: {
        select: { id: true },
      },
    },
  });

  const reqLogger = logger.withRequest(request);

  if (!user) {
    audit.log(reqLogger, request, {
      action: "AUTH_LOGIN",
      severity: "CRITICAL",
      result: "FAILURE",
      metadata: { reason: "Credenciais inválidas", email: payload.email },
    });
    return NextResponse.json<AuthErrorResponse>(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const passwordMatches = await verifyPassword(
    payload.password,
    user.password
  );

  if (!passwordMatches) {
    audit.log(reqLogger, request, {
      action: "AUTH_LOGIN",
      severity: "CRITICAL",
      userId: user.id,
      result: "FAILURE",
      metadata: { reason: "Senha incorreta", email: user.email },
    });
    return NextResponse.json<AuthErrorResponse>(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const session = {
    userId: user.id,
    clienteId: user.cliente?.id || null,
    profissionalId: user.profissional?.id || null,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const response = NextResponse.json<AuthResponse>({
    user: session,
  });

  response.cookies.set(
    getSessionCookieName(),
    createSessionCookieValue(session),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  audit.log(reqLogger, request, {
    action: "AUTH_LOGIN",
    severity: "CRITICAL",
    userId: session.userId,
    result: "SUCCESS",
    metadata: { role: session.role, email: session.email },
  });

  return response;
}
