import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { requireProfessional } from "@/lib/auth/guards";
import type { SolicitacaoProfissionalResumo } from "@/types/solicitacao";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getAuthSession();
    const authError = requireProfessional(
      session,
      "Acesso permitido apenas para profissionais"
    );

    if (authError) {
      return authError;
    }

    const profissionalId = session?.profissionalId;

    if (!profissionalId) {
      return NextResponse.json(
        { error: "Sessão sem profissional associado" },
        { status: 403 }
      );
    }

    const profissional = await prisma.profissional.findUnique({
      where: {
        id: profissionalId,
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const solicitacoes =
      await prisma.solicitarServico.findMany({
        where: {
          profissionalId: profissional.id,
        },
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
