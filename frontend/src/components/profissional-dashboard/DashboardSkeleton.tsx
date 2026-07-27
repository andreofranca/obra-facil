import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-6 border-b border-neutral-border">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex items-center p-5 bg-white/60">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="w-12 h-12 rounded-full" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-6 w-40 mb-2" />
          {/* Requests Skeleton */}
          {[1, 2].map((i) => (
            <Card key={i} className="flex flex-col gap-4 p-6 bg-white/60">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full mt-1" />
              <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-border/40">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Skeleton className="h-6 w-32 mb-2" />
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 h-32 bg-white/60">
              <Skeleton className="h-5 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
