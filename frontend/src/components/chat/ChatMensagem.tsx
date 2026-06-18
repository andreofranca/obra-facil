import type { MensagemChat } from "@/types/chat";

type ChatMensagemProps = {
  mensagem: MensagemChat;
  usuarioAtualId: string;
};

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function ChatMensagem({
  mensagem,
  usuarioAtualId,
}: ChatMensagemProps) {
  const isCurrentUser = mensagem.usuarioId === usuarioAtualId;
  const autor = isCurrentUser
    ? "Você"
    : mensagem.autor?.nome || "Autor não identificado";

  return (
    <article
      className={`rounded-lg border p-4 ${
        isCurrentUser ? "border-blue-200 bg-blue-50" : ""
      }`}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <strong className="text-sm">{autor}</strong>
        <time className="text-xs opacity-70">
          {formatDateTime(mensagem.createdAt)}
        </time>
      </div>

      <p className="mt-3 whitespace-pre-wrap">
        {mensagem.mensagem}
      </p>
    </article>
  );
}
