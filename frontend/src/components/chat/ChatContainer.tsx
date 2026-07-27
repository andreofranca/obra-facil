"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoricoChat, MensagemChat, PayloadCriacaoMensagem } from "@/types/chat";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatComposer } from "./ChatComposer";
import { ChatStatus } from "./ChatStatus";
import { ChatSkeleton } from "./ChatSkeleton";

interface ChatContainerProps {
  solicitacaoId: string;
  usuarioAtualId: string;
  historicoInicial?: HistoricoChat;
  title: string;
  subtitle: string;
  status: SolicitacaoServicoStatus;
}

const POLLING_INTERVAL = 5000;

export function ChatContainer({
  solicitacaoId,
  usuarioAtualId,
  historicoInicial,
  title,
  subtitle,
  status
}: ChatContainerProps) {
  const [mensagens, setMensagens] = useState<MensagemChat[]>(historicoInicial?.mensagens || []);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "syncing" | "error">(!historicoInicial ? "loading" : "idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(!historicoInicial);

  const fetchMensagens = useCallback(async (isPolling = false) => {
    try {
      if (isPolling) {
        setSyncStatus("syncing");
      }

      const response = await fetch(`/api/solicitacoes/${solicitacaoId}/mensagens`);
      if (!response.ok) throw new Error("Falha ao buscar mensagens");
      
      const data = await response.json() as HistoricoChat;
      setMensagens(data.mensagens);
      setSyncStatus("idle");
      setErrorMessage("");
      
      if (isInitialLoad) setIsInitialLoad(false);
    } catch {
      setSyncStatus("error");
      setErrorMessage("Não foi possível atualizar o chat.");
    }
  }, [solicitacaoId, isInitialLoad]);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout;

    if (mounted && isInitialLoad) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMensagens();
    }

    const startPolling = () => {
      timer = setInterval(() => {
        if (mounted) fetchMensagens(true);
      }, POLLING_INTERVAL);
    };

    if (status !== "CONCLUIDA") {
      startPolling();
    }

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [fetchMensagens, isInitialLoad, status]);

  const handleSendMessage = async (mensagemText: string) => {
    setIsSubmitting(true);
    const payload: PayloadCriacaoMensagem = {
      solicitacaoId,
      usuarioId: usuarioAtualId,
      mensagem: mensagemText,
    };

    try {
      const response = await fetch(`/api/solicitacoes/${solicitacaoId}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Não foi possível enviar a mensagem.");
      
      // Imediatamente atualiza
      await fetchMensagens(false);
    } catch {
      alert("Não foi possível enviar a mensagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoad && syncStatus === "loading") {
    return (
      <div className="flex flex-col h-full w-full bg-white rounded-lg overflow-hidden border border-neutral-border shadow-sm">
        <ChatHeader title={title} subtitle={subtitle} status={status} />
        <ChatSkeleton />
      </div>
    );
  }

  const lastUpdate = mensagens.length > 0 
    ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(mensagens[mensagens.length - 1].createdAt))
    : undefined;

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg overflow-hidden border border-neutral-border shadow-sm relative">
      <ChatStatus status={syncStatus} errorMessage={errorMessage} />
      <ChatHeader title={title} subtitle={subtitle} status={status} lastUpdate={lastUpdate} />
      <ChatMessages mensagens={mensagens} usuarioAtualId={usuarioAtualId} />
      {status === "CONCLUIDA" ? (
        <div className="p-4 border-t border-neutral-border bg-neutral-surface mt-auto text-center">
          <p className="text-sm text-neutral-text font-medium flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
            Serviço concluído. O chat foi encerrado.
          </p>
        </div>
      ) : (
        <ChatComposer onSendMessage={handleSendMessage} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
