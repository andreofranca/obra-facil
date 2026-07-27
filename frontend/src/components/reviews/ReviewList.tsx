import { ReviewCard } from "./ReviewCard";
import { ReviewEmptyState } from "./ReviewEmptyState";

interface ReviewListProps {
  avaliacoes: any[];
}

export function ReviewList({ avaliacoes }: ReviewListProps) {
  if (!avaliacoes || avaliacoes.length === 0) {
    return <ReviewEmptyState />;
  }

  return (
    <div className="flex flex-col">
      {avaliacoes.map((avaliacao) => (
        <ReviewCard key={avaliacao.id} {...avaliacao} />
      ))}
    </div>
  );
}
