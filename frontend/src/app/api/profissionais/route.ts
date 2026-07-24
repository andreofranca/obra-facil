import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const id = request.nextUrl.searchParams.get("id");
    const categoria = request.nextUrl.searchParams.get("categoria");
    const q = request.nextUrl.searchParams.get("q");

    const include = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      },
      servicos: {
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      },
    };

    if (id) {
      const profissional = await prisma.profissional.findUnique({
        where: { id },
        include,
      });

      if (!profissional) {
        return NextResponse.json(
          { error: "Profissional não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(profissional);
    }

    const where: import("@prisma/client").Prisma.ProfissionalWhereInput = {};

    if (categoria) {
      where.servicos = {
        some: {
          categoria: {
            nome: categoria,
          },
        },
      };
    }

    if (q) {
      const termoBusca: import("@prisma/client").Prisma.StringFilter = { contains: q, mode: "insensitive" };
      where.OR = [
        { user: { name: termoBusca } },
        { descricao: termoBusca },
        {
          servicos: {
            some: {
              titulo: termoBusca,
            },
          },
        },
      ];
    }

    const profissionais = await prisma.profissional.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include,
      orderBy: {
        avaliacaoMedia: 'desc'
      }
    });

    return NextResponse.json(profissionais);
  } catch (error) {
    reqLogger.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar profissionais" },
      { status: 500 }
    );
  }
}
