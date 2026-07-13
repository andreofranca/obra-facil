import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
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

export async function GET(request: NextRequest) {
  try {
    const clienteId =
      request.nextUrl.searchParams.get("clienteId");

    if (!isNonEmptyString(clienteId)) {
      return apiError("Informe clienteId para buscar solicitações", 400);
    }

    const solicitacoes =
      await prisma.solicitarServico.findMany({
        where: {
          clienteId: clienteId.trim(),
        },
        select: {
          id: true,
          titulo: true,
          descricao: true,
          status: true,
          createdAt: true,
          profissional: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const response: SolicitacaoServicoResumo[] =
      solicitacoes.map((solicitacao) => ({
        id: solicitacao.id,
        titulo: solicitacao.titulo,
        descricao: solicitacao.descricao,
        status: solicitacao.status,
        createdAt: solicitacao.createdAt.toISOString(),
        profissional: solicitacao.profissional
          ? {
              id: solicitacao.profissional.id,
              nome: solicitacao.profissional.user.name,
            }
          : null,
      }));

    return apiSuccess(response);
  } catch (error) {
    console.error(error);

    return apiError("Erro ao buscar solicitações de serviço", 500);
  }
}

export async function POST(request: NextRequest) {
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

    return apiSuccess(solicitacao, 201);
  } catch (error) {
    console.error(error);

    return apiError("Erro ao criar solicitação de serviço", 500);
  }
}
