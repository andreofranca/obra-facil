import { RatingSummary } from "@/domain/RatingService";
import { RatingStars } from "./RatingStars";

interface ReviewHistogramProps {
  summary: RatingSummary;
}

export function ReviewHistogram({ summary }: ReviewHistogramProps) {
  const { distribuicao, total } = summary;
  const labels = [5, 4, 3, 2, 1] as const;

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      {labels.map((star) => {
        const count = distribuicao[star];
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-4 font-medium text-neutral-dark">{star}</span>
            <RatingStars value={1} size="sm" className="opacity-70" />
            
            <div className="flex-1 h-2 bg-neutral-border/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
            <span className="w-8 text-right text-xs text-neutral-text">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}
