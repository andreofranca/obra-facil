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

    startPolling();

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [fetchMensagens, isInitialLoad]);

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
      <ChatComposer onSendMessage={handleSendMessage} isSubmitting={isSubmitting} />
    </div>
  );
}
