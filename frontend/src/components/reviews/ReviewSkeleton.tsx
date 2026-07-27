import { Skeleton } from "@/components/ui/Skeleton";

export function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-border py-6 last:border-0 w-full">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}
