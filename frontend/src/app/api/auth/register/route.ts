import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

import {
  createSessionCookieValue,
  getSessionCookieName,
  hashPassword,
} from "@/lib/auth";
import type {
  AuthErrorResponse,
  AuthResponse,
  RegisterPayload,
} from "@/types/auth";
import { audit } from "@/lib/audit";

const prisma = new PrismaClient();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseRegisterPayload(
  body: unknown
): RegisterPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.name) ||
    !isNonEmptyString(payload.email) ||
    !isNonEmptyString(payload.password)
  ) {
    return null;
  }

  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: isNonEmptyString(payload.phone)
      ? payload.phone.trim()
      : "",
    password: payload.password,
  };
}

export async function POST(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const payload = parseRegisterPayload(await request.json());

    if (!payload) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "Informe nome, email e senha" },
        { status: 400 }
      );
    }

    if (payload.password.length < 6) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        password: passwordHash,
        role: "CLIENT",
        cliente: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cliente: {
          select: {
            id: true,
          },
        },
      },
    });

    const session = {
      userId: user.id,
      clienteId: user.cliente?.id || null,
      profissionalId: null,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json<AuthResponse>(
      { user: session },
      { status: 201 }
    );

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
      action: "AUTH_REGISTER",
      severity: "CRITICAL",
      userId: session.userId,
      result: "SUCCESS",
      metadata: { role: session.role, email: session.email },
    });

    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      audit.log(reqLogger, request, {
        action: "AUTH_REGISTER",
        severity: "CRITICAL",
        result: "FAILURE",
        metadata: { reason: "Email já cadastrado" },
      });
      return NextResponse.json<AuthErrorResponse>(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    reqLogger.error(error);

    return NextResponse.json<AuthErrorResponse>(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 }
    );
  }
}
