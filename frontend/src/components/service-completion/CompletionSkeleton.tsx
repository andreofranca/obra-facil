import { Skeleton } from "@/components/ui/Skeleton";

export function CompletionSkeleton() {
  return (
    <div className="flex flex-col gap-4 border border-neutral-border rounded-lg p-6 bg-white w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-40 mt-4 rounded-md" />
    </div>
  );
}
