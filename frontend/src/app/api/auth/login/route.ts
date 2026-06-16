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
    include: {
      cliente: true,
      profissional: true,
    },
  });

  if (!user) {
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

  return response;
}
