import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId || session.role !== "CLIENT" || !session.clienteId) {
      return apiError("Acesso permitido apenas para clientes", 403);
    }

    const body = await request.json();
    const { profissionalId } = body;

    if (!profissionalId) {
      return apiError("ID do profissional não fornecido", 400);
    }

    const favorito = await prisma.favorito.create({
      data: {
        clienteId: session.clienteId,
        profissionalId,
      },
    });

    return apiSuccess({ favorito }, 201);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'P2002') {
      return apiError("Profissional já está nos favoritos", 400);
    }
    reqLogger.error(error);
    return apiError("Erro ao adicionar favorito", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId || session.role !== "CLIENT" || !session.clienteId) {
      return apiError("Acesso permitido apenas para clientes", 403);
    }

    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissionalId');

    if (!profissionalId) {
      return apiError("ID do profissional não fornecido", 400);
    }

    await prisma.favorito.deleteMany({
      where: {
        clienteId: session.clienteId,
        profissionalId,
      },
    });

    return apiSuccess({ success: true }, 200);
  } catch (error) {
    reqLogger.error(error);
    return apiError("Erro ao remover favorito", 500);
  }
}
