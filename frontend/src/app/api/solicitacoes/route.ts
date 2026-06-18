import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
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
): CriarSolicitacaoServicoPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;

  if (
    !isNonEmptyString(payload.titulo) ||
    !isNonEmptyString(payload.descricao) ||
    !isNonEmptyString(payload.clienteId) ||
    !isNonEmptyString(payload.profissionalId)
  ) {
    return null;
  }

  return {
    titulo: payload.titulo.trim(),
    descricao: payload.descricao.trim(),
    clienteId: payload.clienteId.trim(),
    profissionalId: payload.profissionalId.trim(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const clienteId =
      request.nextUrl.searchParams.get("clienteId");

    if (!isNonEmptyString(clienteId)) {
      return NextResponse.json(
        { error: "Informe clienteId para buscar solicitações" },
        { status: 400 }
      );
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

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar solicitações de serviço" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = parseSolicitacaoPayload(
      await request.json()
    );

    if (!payload) {
      return NextResponse.json(
        {
          error:
            "Informe titulo, descricao, clienteId e profissionalId para criar a solicitação",
        },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: {
        id: payload.clienteId,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const profissional = await prisma.profissional.findUnique({
      where: {
        id: payload.profissionalId,
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const now = new Date();

    const solicitacao =
      await prisma.solicitarServico.create({
        data: {
          titulo: payload.titulo,
          descricao: payload.descricao,
          clienteId: payload.clienteId,
          profissionalId: payload.profissionalId,
          updatedAt: now,
        },
      });

    return NextResponse.json(solicitacao, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar solicitação de serviço" },
      { status: 500 }
    );
  }
}
