import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const categoria =
      request.nextUrl.searchParams.get("categoria");

    const include = {
      user: true,
      servicos: {
        include: {
          categoria: true,
        },
      },
    };

    if (id) {
      const profissional =
        await prisma.profissional.findUnique({
          where: {
            id,
          },
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

    const profissionais =
      await prisma.profissional.findMany({
        include,

        where: categoria
          ? {
              servicos: {
                some: {
                  categoria: {
                    nome: categoria,
                  },
                },
              },
            }
          : undefined,
      });

    return NextResponse.json(profissionais);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar profissionais" },
      { status: 500 }
    );
  }
}
