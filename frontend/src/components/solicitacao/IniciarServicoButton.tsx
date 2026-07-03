"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type IniciarServicoButtonProps = {
  solicitacaoId: string;
};

export default function IniciarServicoButton({ solicitacaoId }: IniciarServicoButtonProps) {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setIsStarting(true);

    try {
      const response = await fetch(`/api/solicitacoes/${solicitacaoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "EM_ANDAMENTO" }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Erro" }));
        alert(body.error || "Falha ao iniciar serviço.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro de rede ao iniciar serviço.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={isStarting}
      className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {isStarting ? "Iniciando..." : "Iniciar Serviço"}
    </button>
  );
}
