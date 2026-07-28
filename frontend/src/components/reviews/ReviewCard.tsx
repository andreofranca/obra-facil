import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "./RatingStars";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  id: string;
  nota: number;
  comentario: string | null;
  createdAt: string;
  cliente: {
    nome: string;
    avatarUrl?: string;
  };
  solicitacao: {
    titulo: string;
  };
}

export function ReviewCard({ nota, comentario, createdAt, cliente, solicitacao }: ReviewCardProps) {
  const initial = cliente.nome.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-border py-6 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar initials={initial} className="w-10 h-10" />
          <div>
            <h4 className="text-sm font-semibold text-neutral-dark">{cliente.nome}</h4>
            <span className="text-xs text-neutral-text">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
            </span>
          </div>
        </div>
        <RatingStars value={nota} size="sm" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-text bg-neutral-surface px-2 py-1 rounded w-fit">
          Serviço: {solicitacao.titulo}
        </span>
        {comentario && (
          <p className="text-sm text-neutral-dark mt-2 leading-relaxed">
            &quot;{comentario}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
