import { RatingStars } from "./RatingStars";

interface ReviewBadgeProps {
  media: number;
  total: number;
  className?: string;
}

export function ReviewBadge({ media, total, className = "" }: ReviewBadgeProps) {
  if (total === 0) {
    return (
      <div className={`flex items-center gap-1.5 text-neutral-text text-sm ${className}`}>
        <RatingStars value={0} size="sm" />
        <span>Novo</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-neutral-dark text-sm font-medium ${className}`}>
      <RatingStars value={Math.round(media)} size="sm" />
      <span>{media.toFixed(1)}</span>
      <span className="text-neutral-text font-normal">({total})</span>
    </div>
  );
}
