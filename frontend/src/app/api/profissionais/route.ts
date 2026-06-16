import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const categoria =
      request.nextUrl.searchParams.get("categoria");

    const profissionais =
      await prisma.profissional.findMany({
        include: {
          user: true,
          servicos: {
            include: {
              categoria: true,
            },
          },
        },

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