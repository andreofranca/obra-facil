import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
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

function parsePayload(body: unknown): CriarPropostaPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const valor = parsePositiveNumber(payload.valor);
  const prazoDias = parsePositiveInteger(payload.prazoDias);

  if (
    !isNonEmptyString(payload.solicitacaoId) ||
    !isNonEmptyString(payload.profissionalId) ||
    !isNonEmptyString(payload.mensagem) ||
    valor === null ||
    prazoDias === null
  ) {
    return null;
  }

  return {
    solicitacaoId: payload.solicitacaoId.trim(),
    profissionalId: payload.profissionalId.trim(),
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
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: "Filtro de cliente não permitido" },
        { status: 403 }
      );
    }

    if (
      profissionalId &&
      profissionalId !== session.profissionalId
    ) {
      return NextResponse.json(
        { error: "Filtro de profissional não permitido" },
        { status: 403 }
      );
    }

    const propostas = await prisma.proposta.findMany({
      where: {
        solicitacaoId: solicitacaoId || undefined,
        profissionalId:
          profissionalId ||
          (session.role === "PROFESSIONAL"
            ? session.profissionalId || undefined
            : undefined),
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

    return NextResponse.json(
      propostas.map(mapProposta) satisfies PropostaResumo[]
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar propostas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    if (
      session.role !== "PROFESSIONAL" ||
      !session.profissionalId
    ) {
      return NextResponse.json(
        { error: "Apenas profissionais podem criar propostas" },
        { status: 403 }
      );
    }

    const payload = parsePayload(await request.json());

    if (!payload) {
      return NextResponse.json(
        {
          error:
            "Informe solicitacaoId, profissionalId, valor, prazoDias e mensagem",
        },
        { status: 400 }
      );
    }

    if (payload.profissionalId !== session.profissionalId) {
      return NextResponse.json(
        { error: "Profissional inválido para a sessão atual" },
        { status: 403 }
      );
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
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    if (solicitacao.profissionalId !== session.profissionalId) {
      return NextResponse.json(
        { error: "Solicitação não vinculada a este profissional" },
        { status: 403 }
      );
    }

    const proposta = await prisma.proposta.create({
      data: {
        solicitacaoId: payload.solicitacaoId,
        profissionalId: payload.profissionalId,
        valor: payload.valor,
        prazoDias: payload.prazoDias,
        mensagem: payload.mensagem,
      },
      include: propostaInclude,
    });

    return NextResponse.json(mapProposta(proposta), {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar proposta" },
      { status: 500 }
    );
  }
}
