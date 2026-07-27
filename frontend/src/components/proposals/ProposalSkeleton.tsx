import { Card, Skeleton } from "@/components/ui";

export function ProposalSkeleton() {
  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 mb-4">
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton className="w-full max-w-md h-4 mt-2" />
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-24 h-5" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-24 h-10" />
      </div>
    </Card>
  );
}
