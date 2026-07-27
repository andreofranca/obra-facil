import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const reqLogger = logger.withRequest(request);
  try {
    const { id } = await context.params;

    // TODO: Pagination via search params
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit")) || 20;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const avaliacoes = await prisma.avaliacaoServico.findMany({
      where: { profissionalId: id },
      include: {
        cliente: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        solicitacao: {
          select: {
            id: true,
            titulo: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.avaliacaoServico.count({
      where: { profissionalId: id }
    });

    return apiSuccess({
      items: avaliacoes.map(a => ({
        id: a.id,
        nota: a.nota,
        comentario: a.comentario,
        createdAt: a.createdAt.toISOString(),
        cliente: {
          id: a.cliente.id,
          nome: a.cliente.user.name,
        },
        solicitacao: {
          id: a.solicitacao.id,
          titulo: a.solicitacao.titulo,
        }
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    reqLogger.error(error);
    return apiError("Erro ao buscar avaliações", 500);
  }
}
