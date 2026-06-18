"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  HistoricoChat,
  PayloadCriacaoMensagem,
} from "@/types/chat";
import ChatFormulario from "./ChatFormulario";
import ChatMensagem from "./ChatMensagem";

type ChatMensagensProps = {
  historicoInicial: HistoricoChat;
  solicitacaoId: string;
  usuarioAtualId: string;
};

export default function ChatMensagens({
  historicoInicial,
  solicitacaoId,
  usuarioAtualId,
}: ChatMensagensProps) {
  const router = useRouter();
  const [historico, setHistorico] =
    useState<HistoricoChat>(historicoInicial);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refetchMensagens() {
    const response = await fetch(
      `/api/solicitacoes/${solicitacaoId}/mensagens`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      setErrorMessage(
        "Mensagem enviada, mas não foi possível atualizar o histórico."
      );
      return;
    }

    setHistorico((await response.json()) as HistoricoChat);
    router.refresh();
  }

  async function handleSubmit(mensagem: string) {
    setIsSubmitting(true);
    setErrorMessage("");

    const payload: PayloadCriacaoMensagem = {
      solicitacaoId,
      usuarioId: usuarioAtualId,
      mensagem,
    };

    try {
      const response = await fetch(
        `/api/solicitacoes/${solicitacaoId}/mensagens`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setErrorMessage("Não foi possível enviar a mensagem.");
        return;
      }

      await refetchMensagens();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Histórico de mensagens
      </h2>

      <div className="space-y-3">
        {historico.mensagens.length === 0 ? (
          <p className="rounded-lg border p-4 opacity-80">
            Nenhuma mensagem enviada até o momento.
          </p>
        ) : (
          historico.mensagens.map((mensagem) => (
            <ChatMensagem
              key={mensagem.id}
              mensagem={mensagem}
              usuarioAtualId={usuarioAtualId}
            />
          ))
        )}
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <div className="mt-6">
        <ChatFormulario
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
