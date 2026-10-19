import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";
import {
  createSessionCookieValue,
  getSessionCookieName,
  hashPassword,
} from "@/lib/auth";
import { isValidPassword } from "@/lib/validation/password";
import { LIMITS } from "@/lib/constants/limits";
import type {
  AuthErrorResponse,
  AuthResponse,
  AuthSession,
  RegisterProfissionalPayload,
} from "@/types/auth";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePayload(body: unknown): RegisterProfissionalPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.name) ||
    !isNonEmptyString(payload.email) ||
    !isNonEmptyString(payload.password) ||
    !isNonEmptyString(payload.phone) ||
    !isNonEmptyString(payload.categoriaId) ||
    !isNonEmptyString(payload.descricao)
  ) {
    return null;
  }

  const experiencia =
    typeof payload.experiencia === "number" && !isNaN(payload.experiencia)
      ? Math.max(0, Math.min(60, Math.floor(payload.experiencia)))
      : undefined;

  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    password: payload.password,
    categoriaId: payload.categoriaId.trim(),
    descricao: payload.descricao.trim(),
    experiencia,
    cidade: isNonEmptyString(payload.cidade) ? payload.cidade.trim() : undefined,
    estado: isNonEmptyString(payload.estado) ? payload.estado.trim().toUpperCase() : undefined,
    whatsapp: isNonEmptyString(payload.whatsapp) ? payload.whatsapp.trim() : undefined,
  };
}

export async function POST(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<AuthErrorResponse>(
        { error: "Corpo da requisição inválido" },
        { status: 400 }
      );
    }

    const payload = parsePayload(body);

    if (!payload) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "Informe nome, email, senha, telefone, especialidade e apresentação profissional" },
        { status: 400 }
      );
    }

    if (payload.name.length < 3 || payload.name.length > LIMITS.NAME_MAX) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "O nome deve ter entre 3 e 120 caracteres" },
        { status: 400 }
      );
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email) || payload.email.length > LIMITS.EMAIL_MAX) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "Formato de e-mail inválido" },
        { status: 400 }
      );
    }

    // Validação estrita de senha
    if (!isValidPassword(payload.password)) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "A senha deve ter entre 8 e 100 caracteres e conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial" },
        { status: 400 }
      );
    }

    if (payload.descricao.length < 10 || payload.descricao.length > LIMITS.DESCRIPTION_MAX) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "A apresentação profissional deve ter entre 10 e 2000 caracteres" },
        { status: 400 }
      );
    }

    // 1. Verifica duplicidade de e-mail
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      audit.log(reqLogger, request, {
        action: "AUTH_REGISTER",
        severity: "CRITICAL",
        result: "FAILURE",
        metadata: { reason: "Email já cadastrado", email: payload.email },
      });
      return NextResponse.json<AuthErrorResponse>(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // 2. Valida existência da categoria
    const categoria = await prisma.categoriaServico.findUnique({
      where: { id: payload.categoriaId },
      select: { id: true, nome: true },
    });

    if (!categoria) {
      return NextResponse.json<AuthErrorResponse>(
        { error: "Especialidade selecionada não encontrada" },
        { status: 400 }
      );
    }

    // 3. Hash seguro da senha
    const passwordHash = await hashPassword(payload.password);

    // 4. Criação atômica: Usuário (PROFESSIONAL), Profissional, Serviço e Endereço
    const user = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: passwordHash,
          role: "PROFESSIONAL", // Definido estritamente no servidor (anti-escalonamento)
          profissional: {
            create: {
              descricao: payload.descricao,
              experiencia: payload.experiencia,
              ativo: true,
              whatsapp: payload.whatsapp || payload.phone,
              disponibilidade: "Imediata",
              obrasExecutadas: 0,
              endereco:
                payload.cidade || payload.estado
                  ? {
                      create: {
                        cidade: payload.cidade,
                        estado: payload.estado,
                      },
                    }
                  : undefined,
              servicos: {
                create: [
                  {
                    titulo: `Serviço de ${categoria.nome}`,
                    descricao: payload.descricao,
                    categoriaId: categoria.id,
                  },
                ],
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profissional: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    const session: AuthSession = {
      userId: user.id,
      clienteId: null,
      profissionalId: user.profissional?.id || null,
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
      metadata: { role: session.role, email: session.email, profissionalId: session.profissionalId },
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
      { error: "Erro interno ao cadastrar profissional" },
      { status: 500 }
    );
  }
}
