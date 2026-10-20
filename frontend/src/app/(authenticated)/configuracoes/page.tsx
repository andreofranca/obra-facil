import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import ConfiguracoesClient from "./ConfiguracoesClient";

export const metadata = {
  title: "Configurações | ObraFácil",
  description: "Gerencie suas preferências de segurança e conta.",
};

export default async function ConfiguracoesPage() {
  const session = await getAuthSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  return <ConfiguracoesClient user={session} />;
}
