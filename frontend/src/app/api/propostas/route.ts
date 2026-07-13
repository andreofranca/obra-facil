import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import type {
  CriarPropostaPayload,
  PropostaResumo,
} from "@/types/proposta";

const prisma = new PrismaClient();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePositiveNumber(value: unknown) {
  const numberValue =
    typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : null;
}

function parsePositiveInteger(value: unknown) {
  const numberValue =
    typeof value === "number" ? value : Number(value);

  return Number.isInteger(numberValue) && numberValue > 0
    ? numberValue
    : null;
}

function parsePayload(
  body: unknown
): Omit<CriarPropostaPayload, "profissionalId"> | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const valor = parsePositiveNumber(payload.valor);
  const prazoDias = parsePositiveInteger(payload.prazoDias);

  if (
    !isNonEmptyString(payload.solicitacaoId) ||
    !isNonEmptyString(payload.mensagem) ||
    valor === null ||
    prazoDias === null
  ) {
    return null;
  }

  return {
    solicitacaoId: payload.solicitacaoId.trim(),
    valor: valor.toFixed(2),
    prazoDias,
    mensagem: payload.mensagem.trim(),
  };
}

function mapProposta(proposta: {
  id: string;
  valor: { toString: () => string };
  prazoDias: number;
  mensagem: string;
  status: "PENDENTE" | "ACEITA" | "RECUSADA";
  createdAt: Date;
  updatedAt: Date;
  solicitacao: {
    id: string;
    titulo: string;
    descricao: string;
    cliente: {
      id: string;
      user: {
        name: string;
        email: string;
      };
    };
  };
  profissional: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}): PropostaResumo {
  return {
    id: proposta.id,
    valor: proposta.valor.toString(),
    prazoDias: proposta.prazoDias,
    mensagem: proposta.mensagem,
    status: proposta.status,
    createdAt: proposta.createdAt.toISOString(),
    updatedAt: proposta.updatedAt.toISOString(),
    solicitacao: {
      id: proposta.solicitacao.id,
      titulo: proposta.solicitacao.titulo,
      descricao: proposta.solicitacao.descricao,
      cliente: {
        id: proposta.solicitacao.cliente.id,
        nome: proposta.solicitacao.cliente.user.name,
        email: proposta.solicitacao.cliente.user.email,
      },
    },
    profissional: {
      id: proposta.profissional.id,
      nome: proposta.profissional.user.name,
      email: proposta.profissional.user.email,
    },
  };
}

const propostaInclude = {
  solicitacao: {
    include: {
      cliente: {
        include: {
          user: true,
        },
      },
    },
  },
  profissional: {
    include: {
      user: true,
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return apiError("Usuário não autenticado", 401);
    }

    const clienteId =
      request.nextUrl.searchParams.get("clienteId");
    const profissionalId =
      request.nextUrl.searchParams.get("profissionalId");
    const solicitacaoId =
      request.nextUrl.searchParams.get("solicitacaoId");

    if (
      clienteId &&
      clienteId !== session.clienteId
    ) {
      return apiError("Filtro de cliente não permitido", 403);
    }

    if (
      profissionalId &&
      profissionalId !== session.profissionalId
    ) {
      return apiError("Filtro de profissional não permitido", 403);
    }

    const sessionProfissionalId =
      session.role === "PROFESSIONAL"
        ? session.profissionalId || undefined
        : undefined;

    const propostas = await prisma.proposta.findMany({
      where: {
        solicitacaoId: solicitacaoId || undefined,
        profissionalId:
          sessionProfissionalId || profissionalId || undefined,
        solicitacao: {
          clienteId:
            clienteId ||
            (session.role === "CLIENT"
              ? session.clienteId || undefined
              : undefined),
        },
      },
      include: propostaInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return apiSuccess(
      propostas.map(mapProposta) satisfies PropostaResumo[]
    );
  } catch (error) {
    console.error(error);

    return apiError("Erro ao buscar propostas", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return apiError("Usuário não autenticado", 401);
    }

    if (session.role !== "PROFESSIONAL") {
      return apiError("Apenas profissionais podem criar propostas", 403);
    }

    const payload = parsePayload(await request.json());

    if (!payload) {
      return apiError(
        "Informe solicitacaoId, valor, prazoDias e mensagem",
        400
      );
    }

    if (!session.profissionalId) {
      return apiError("Profissional inválido para a sessão atual", 403);
    }

    const solicitacao =
      await prisma.solicitarServico.findUnique({
        where: {
          id: payload.solicitacaoId,
        },
        select: {
          id: true,
          profissionalId: true,
        },
      });

    if (!solicitacao) {
      return apiError("Solicitação não encontrada", 404);
    }

    if (solicitacao.profissionalId !== session.profissionalId) {
      return apiError("Solicitação não vinculada a este profissional", 403);
    }

    const proposta = await prisma.proposta.create({
      data: {
        solicitacaoId: payload.solicitacaoId,
        profissionalId: session.profissionalId,
        valor: payload.valor,
        prazoDias: payload.prazoDias,
        mensagem: payload.mensagem,
      },
      include: propostaInclude,
    });

    return apiSuccess(mapProposta(proposta), 201);
  } catch (error) {
    console.error(error);

    return apiError("Erro ao criar proposta", 500);
  }
}
