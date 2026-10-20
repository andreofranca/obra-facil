import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PerfilClient, { PerfilUserData } from "./PerfilClient";

export const metadata = {
  title: "Meu Perfil | ObraFácil",
  description: "Gerencie seus dados de perfil e preferências cadastrais.",
};

export default async function MeuPerfilPage() {
  const session = await getAuthSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      cliente: {
        select: {
          id: true,
          _count: {
            select: {
              solicitacoes: true,
              avaliacoesServico: true,
              favoritos: true,
            },
          },
        },
      },
      profissional: {
        select: {
          id: true,
          descricao: true,
          experiencia: true,
          ativo: true,
          fotoPerfil: true,
          fotoCapa: true,
          obrasExecutadas: true,
          disponibilidade: true,
          whatsapp: true,
          endereco: {
            select: {
              cidade: true,
              estado: true,
              bairro: true,
              cep: true,
              logradouro: true,
              numero: true,
              complemento: true,
            },
          },
          servicos: {
            select: {
              id: true,
              titulo: true,
              categoria: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
          _count: {
            select: {
              solicitacoes: true,
              avaliacoesServico: true,
              propostas: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const serializedUser: PerfilUserData = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };

  return <PerfilClient initialUser={serializedUser} />;
}
