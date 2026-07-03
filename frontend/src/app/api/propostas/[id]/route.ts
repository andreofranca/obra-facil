import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const { id } = await context.params;

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const status = body.status as "ACEITA" | "RECUSADA" | undefined;

    if (status !== "ACEITA" && status !== "RECUSADA") {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const proposta = await prisma.proposta.findUnique({ where: { id } });

    if (!proposta) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 });
    }

    const solicitacao = await prisma.solicitarServico.findUnique({ where: { id: proposta.solicitacaoId } });

    if (!solicitacao) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    // Autorização: somente cliente proprietário pode aceitar/recusar
    if (session.role !== "CLIENT" || !session.clienteId || session.clienteId !== solicitacao.clienteId) {
      return NextResponse.json({ error: "Ação permitida apenas para o cliente proprietário" }, { status: 403 });
    }

    if (status === "ACEITA") {
      if (proposta.status === "ACEITA") {
        return NextResponse.json({ error: "Proposta já aceita" }, { status: 400 });
      }

      try {
        await prisma.$transaction(async (tx) => {
          const alreadyAccepted = await tx.proposta.findFirst({
            where: { solicitacaoId: proposta.solicitacaoId, status: "ACEITA" },
          });

          if (alreadyAccepted) {
            throw new Error("Já existe uma proposta aceita para esta solicitação");
          }

          await tx.proposta.update({
            where: { id },
            data: { status: "ACEITA", updatedAt: new Date() },
          });

          await tx.proposta.updateMany({
            where: { solicitacaoId: proposta.solicitacaoId, id: { not: id } },
            data: { status: "RECUSADA", updatedAt: new Date() },
          });

          await tx.solicitarServico.update({
            where: { id: proposta.solicitacaoId },
            data: { status: "EM_ANDAMENTO", updatedAt: new Date() },
          });
        });
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: String(err) }, { status: 400 });
      }

      const updated = await prisma.proposta.findUnique({ where: { id } });

      return NextResponse.json(updated);
    }

    // RECUSADA
    if (proposta.status === "ACEITA") {
      return NextResponse.json({ error: "Proposta aceita não pode ser modificada" }, { status: 400 });
    }

    const recusada = await prisma.proposta.update({
      where: { id },
      data: { status: "RECUSADA", updatedAt: new Date() },
    });

    return NextResponse.json(recusada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 });
  }
}
