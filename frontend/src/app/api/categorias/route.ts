import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categorias = await prisma.categoriaServico.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}