import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MensagensClient } from "./MensagensClient";
import type { ConversaItem } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export const dynamic = "force-dynamic";

export default async function MensagensPage({
  searchParams,
}: {
  searchParams?: Promise<{ solicitacaoId?: string }>;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const solicitacaoIdParam = resolvedParams.solicitacaoId;

  let conversas: ConversaItem[] = [];

  if (session.role === "CLIENT" && session.clienteId) {
    const solicitacoes = await prisma.solicitarServico.findMany({
      where: {
        clienteId: session.clienteId,
        profissionalId: { not: null },
      },
      include: {
        profissional: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        mensagens: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            autor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { mensagens: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    conversas = solicitacoes.map((s) => ({
      id: s.id,
      titulo: s.titulo,
      status: s.status as SolicitacaoServicoStatus,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      interlocutor: {
        id: s.profissional?.id || "",
        nome: s.profissional?.user.name || "Profissional",
        role: "PROFESSIONAL",
        email: s.profissional?.user.email,
      },
      ultimaMensagem: s.mensagens[0]
        ? {
            id: s.mensagens[0].id,
            mensagem: s.mensagens[0].mensagem,
            createdAt: s.mensagens[0].createdAt.toISOString(),
            autorNome: s.mensagens[0].autor?.name,
          }
        : null,
      totalMensagens: s._count.mensagens,
    }));
  } else if (session.role === "PROFESSIONAL" && session.profissionalId) {
    const solicitacoes = await prisma.solicitarServico.findMany({
      where: {
        profissionalId: session.profissionalId,
      },
      include: {
        cliente: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        mensagens: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            autor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { mensagens: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    conversas = solicitacoes.map((s) => ({
      id: s.id,
      titulo: s.titulo,
      status: s.status as SolicitacaoServicoStatus,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      interlocutor: {
        id: s.cliente.id,
        nome: s.cliente.user.name,
        role: "CLIENT",
        email: s.cliente.user.email,
      },
      ultimaMensagem: s.mensagens[0]
        ? {
            id: s.mensagens[0].id,
            mensagem: s.mensagens[0].mensagem,
            createdAt: s.mensagens[0].createdAt.toISOString(),
            autorNome: s.mensagens[0].autor?.name,
          }
        : null,
      totalMensagens: s._count.mensagens,
    }));
  }

  return (
    <MensagensClient
      conversas={conversas}
      usuarioAtual={{
        id: session.userId,
        name: session.name || "Usuário",
        role: session.role,
      }}
      initialSelectedId={solicitacaoIdParam}
    />
  );
}
