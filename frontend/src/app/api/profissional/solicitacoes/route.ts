import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import type { SolicitacaoProfissionalResumo } from "@/types/solicitacao";

const prisma = new PrismaClient();

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function GET() {
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
        { error: "Acesso permitido apenas para profissionais" },
        { status: 403 }
      );
    }

    const profissional = await prisma.profissional.findUnique({
      where: {
        id: session.profissionalId,
      },
      include: {
        servicos: {
          include: {
            categoria: true,
          },
        },
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const termos = profissional.servicos.flatMap((servico) => [
      normalize(servico.titulo),
      normalize(servico.categoria.nome),
    ]);

    const solicitacoes =
      await prisma.solicitarServico.findMany({
        include: {
          cliente: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const response: SolicitacaoProfissionalResumo[] =
      solicitacoes
        .filter((solicitacao) => {
          const textoSolicitacao = normalize(
            `${solicitacao.titulo} ${solicitacao.descricao}`
          );

          return termos.some((termo) =>
            termo.length > 0
              ? textoSolicitacao.includes(termo)
              : false
          );
        })
        .map((solicitacao) => ({
          id: solicitacao.id,
          titulo: solicitacao.titulo,
          descricao: solicitacao.descricao,
          status: solicitacao.status,
          createdAt: solicitacao.createdAt.toISOString(),
          cliente: {
            id: solicitacao.cliente.id,
            nome: solicitacao.cliente.user.name,
            email: solicitacao.cliente.user.email,
            telefone: solicitacao.cliente.user.phone,
          },
        }));

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar solicitações do profissional" },
      { status: 500 }
    );
  }
}
