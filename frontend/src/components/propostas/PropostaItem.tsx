"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropostaResumo } from "@/types/proposta";

export default function PropostaItem({ proposta }: { proposta: PropostaResumo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: "ACEITA" | "RECUSADA") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/propostas/${proposta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body?.error || "Erro");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">R$ {proposta.valor}</div>
          <div className="text-sm text-gray-600">Prazo: {proposta.prazoDias} dias</div>
        </div>
        <div>
          <span
            className={`px-2 py-1 rounded text-sm ${
              proposta.status === "PENDENTE"
                ? "bg-yellow-100 text-yellow-800"
                : proposta.status === "ACEITA"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {proposta.status}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm">{proposta.mensagem}</p>

      <div className="mt-4 flex gap-2">
        {proposta.status === "ACEITA" ? (
          <span className="text-green-700 font-semibold">Proposta Aceita</span>
        ) : (
          <>
            {proposta.status === "PENDENTE" && (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                onClick={() => handleAction("ACEITA")}
                disabled={loading}
              >
                Aceitar
              </button>
            )}

            {proposta.status === "PENDENTE" && (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                onClick={() => handleAction("RECUSADA")}
                disabled={loading}
              >
                Recusar
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
