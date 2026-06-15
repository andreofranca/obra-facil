import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const profissionais = await prisma.profissional.findMany({
      include: {
        user: true,
        servicos: true,
      },
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