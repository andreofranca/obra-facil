import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { audit } from "@/lib/audit";

import type {
  CriarSolicitacaoServicoPayload,
  SolicitacaoServicoResumo,
} from "@/types/solicitacao";

const prisma = new PrismaClient();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseSolicitacaoPayload(
  body: unknown
): Omit<CriarSolicitacaoServicoPayload, "clienteId"> | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.titulo) ||
    !isNonEmptyString(payload.descricao) ||
    !isNonEmptyString(payload.profissionalId)
  ) {
    return null;
  }

  return {
    titulo: payload.titulo.trim(),
    descricao: payload.descricao.trim(),
    profissionalId: payload.profissionalId.trim(),
  };
}

export async function GET(_request: NextRequest) {
  const reqLogger = logger.withRequest(_request);
  try {
    const session = await getAuthSession();

    if (!session || !session.clienteId) {
      return apiError("Usuário não autenticado", 401);
    }

    // Force filtering by the authenticated user's ID to prevent IDOR
    const clienteId = session.clienteId;

    const { paginate, PaginationRequest } = await import("@/lib/pagination");
    const paginationRequest = PaginationRequest.fromSearchParams(_request.nextUrl.searchParams);

    const paginatedSolicitacoes =
      await paginate(prisma.solicitarServico as unknown as import("@/lib/pagination").PrismaDelegate<unknown>, paginationRequest, {
        where: {
          clienteId: clienteId,
        },
        select: {
          id: true,
          titulo: true,
          descricao: true,
          status: true,
          createdAt: true,
          profissional: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const responseItems: SolicitacaoServicoResumo[] =
      paginatedSolicitacoes.items.map((solicitacao: unknown) => {
        const s = solicitacao as {
          id: string;
          titulo: string;
          descricao: string;
          status: string;
          createdAt: Date;
          profissional?: { id: string; user: { name: string } } | null;
        };
        return {
          id: s.id,
          titulo: s.titulo,
          descricao: s.descricao,
          status: s.status as import("@prisma/client").SolicitacaoStatus,
          createdAt: s.createdAt.toISOString(),
          profissional: s.profissional
            ? {
                id: s.profissional.id,
                nome: s.profissional.user.name,
              }
            : null,
        };
      });

    return apiSuccess({
      ...paginatedSolicitacoes,
      items: responseItems
    });
  } catch (error) {
    reqLogger.error(error);

    return apiError("Erro ao buscar solicitações de serviço", 500);
  }
}

export async function POST(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session) {
      return apiError("Usuário não autenticado", 401);
    }

    if (session.role !== "CLIENT") {
      return apiError("Acesso permitido apenas para clientes", 403);
    }

    if (!session?.clienteId) {
      return apiError("Cliente não encontrado", 404);
    }

    const payload = parseSolicitacaoPayload(
      await request.json()
    );

    if (!payload) {
      return apiError(
        "Informe titulo, descricao e profissionalId para criar a solicitação",
        400
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: {
        id: session.clienteId,
      },
    });

    if (!cliente) {
      return apiError("Cliente não encontrado", 404);
    }

    const profissional = await prisma.profissional.findUnique({
      where: {
        id: payload.profissionalId,
      },
    });

    if (!profissional) {
      return apiError("Profissional não encontrado", 404);
    }

    const now = new Date();

    const solicitacao =
      await prisma.solicitarServico.create({
        data: {
          titulo: payload.titulo,
          descricao: payload.descricao,
          clienteId: session.clienteId,
          profissionalId: payload.profissionalId,
          updatedAt: now,
        },
      });

    audit.log(reqLogger, request, {
      action: "SOLICITACAO_CREATED",
      severity: "CRITICAL",
      userId: session.userId,
      targetId: solicitacao.id,
      result: "SUCCESS",
      metadata: { profissionalId: payload.profissionalId },
    });

    return apiSuccess(solicitacao, 201);
  } catch (error) {
    audit.log(reqLogger, request, {
      action: "SOLICITACAO_CREATED",
      severity: "CRITICAL",
      result: "FAILURE",
      metadata: { reason: "Internal Error" },
    });
    reqLogger.error(error);

    return apiError("Erro ao criar solicitação de serviço", 500);
  }
}
