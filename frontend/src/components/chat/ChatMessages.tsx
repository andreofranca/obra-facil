"use client";

import { useEffect, useRef } from "react";
import type { MensagemChat } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatEmptyState } from "./ChatEmptyState";

interface ChatMessagesProps {
  mensagens: MensagemChat[];
  usuarioAtualId: string;
}

export function ChatMessages({ mensagens, usuarioAtualId }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const prevLengthRef = useRef(mensagens.length);

  useEffect(() => {
    if (bottomRef.current && mensagens.length > prevLengthRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = mensagens.length;
  }, [mensagens.length]);

  if (mensagens.length === 0) {
    return <ChatEmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-neutral-surface flex flex-col min-h-0">
      {mensagens.map((mensagem, index) => {
        const isCurrentUser = mensagem.usuarioId === usuarioAtualId;
        const previousMessage = index > 0 ? mensagens[index - 1] : null;
        const showAvatar = previousMessage?.usuarioId !== mensagem.usuarioId;

        return (
          <ChatMessage 
            key={mensagem.id} 
            mensagem={mensagem} 
            isCurrentUser={isCurrentUser} 
            showAvatar={showAvatar}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
