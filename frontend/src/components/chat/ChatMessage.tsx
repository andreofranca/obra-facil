import { Avatar } from "@/components/ui/Avatar";
import type { MensagemChat } from "@/types/chat";
interface ChatMessageProps {
  mensagem: MensagemChat;
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function ChatMessage({ mensagem, isCurrentUser, showAvatar = true }: ChatMessageProps) {
  const authorName = isCurrentUser ? "Você" : mensagem.autor?.nome || "Sistema";
  const formattedTime = formatTime(mensagem.createdAt);

  return (
    <div className={`flex gap-2 w-full mb-4 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
      {showAvatar ? (
        <div className="flex-shrink-0 mt-auto">
          <Avatar 
            initials={authorName[0]} 
            className={`w-8 h-8 text-xs ${isCurrentUser ? "bg-brand-primary" : "bg-neutral-muted"}`} 
          />
        </div>
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isCurrentUser ? "items-end" : "items-start"}`}>
        {showAvatar && (
          <span className="text-xs text-neutral-muted mb-1 px-1">
            {authorName}
          </span>
        )}
        
        <div 
          className={`relative px-4 py-2 text-sm shadow-sm
            ${isCurrentUser 
              ? "bg-brand-primary text-white rounded-2xl rounded-br-sm" 
              : "bg-neutral-surface border border-neutral-border text-neutral-text rounded-2xl rounded-bl-sm"
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{mensagem.mensagem}</p>
          <span 
            className={`block text-[10px] text-right mt-1 opacity-70 ${isCurrentUser ? "text-white/80" : "text-neutral-muted"}`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
