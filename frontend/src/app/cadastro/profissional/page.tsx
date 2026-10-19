import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CadastroProfissionalClient } from "./CadastroProfissionalClient";

export const metadata = {
  title: "Cadastro de Profissional | ObraFácil",
  description: "Crie seu perfil profissional no ObraFácil e receba orçamentos de clientes na sua região.",
};

export default async function CadastroProfissionalPage() {
  const session = await getAuthSession();

  if (session) {
    if (session.role === "PROFESSIONAL") {
      redirect("/profissional/pedidos");
    } else {
      redirect("/meus-pedidos");
    }
  }

  const categorias = await prisma.categoriaServico.findMany({
    select: {
      id: true,
      nome: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  return <CadastroProfissionalClient categorias={categorias} />;
}
