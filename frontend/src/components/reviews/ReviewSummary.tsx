import { RatingSummary } from "@/domain/RatingService";
import { RatingStars } from "./RatingStars";
import { ReviewHistogram } from "./ReviewHistogram";

interface ReviewSummaryProps {
  summary: RatingSummary;
}

export function ReviewSummary({ summary }: ReviewSummaryProps) {
  const { media, total } = summary;

  if (total === 0) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-neutral-surface rounded-lg border border-neutral-border">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold text-neutral-dark">0.0</span>
          <RatingStars value={0} size="md" className="my-2" />
          <span className="text-sm text-neutral-text">Sem avaliações</span>
        </div>
        <div className="flex-1 w-full">
          <ReviewHistogram summary={summary} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-neutral-surface rounded-lg border border-neutral-border">
      <div className="flex flex-col items-center text-center min-w-[120px]">
        <span className="text-4xl font-bold text-neutral-dark">{media.toFixed(1)}</span>
        <RatingStars value={Math.round(media)} size="md" className="my-2" />
        <span className="text-sm text-neutral-text">{total} avaliação{total !== 1 ? 'ões' : ''}</span>
      </div>
      <div className="flex-1 w-full">
        <ReviewHistogram summary={summary} />
      </div>
    </div>
  );
}
