"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ChatComposerProps {
  onSendMessage: (mensagem: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
}

export function ChatComposer({ onSendMessage, isSubmitting, placeholder = "Digite sua mensagem..." }: ChatComposerProps) {
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmed = mensagem.trim();
    if (!trimmed || isSubmitting) return;

    await onSendMessage(trimmed);
    setMensagem("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-end gap-2 p-4 border-t border-neutral-border bg-neutral-surface mt-auto"
    >
      <div className="flex-1">
        <Textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="min-h-[44px] max-h-32 resize-none py-3"
          rows={1}
        />
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isSubmitting || !mensagem.trim()}
        className="mb-1 rounded-full w-10 h-10 p-0 flex items-center justify-center flex-shrink-0"
        aria-label="Enviar mensagem"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        )}
      </Button>
    </form>
  );
}
