import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-12">
        {/* Skeleton for Hero roughly */}
        <div className="flex flex-col md:flex-row gap-8 items-center py-16">
          <div className="flex-1 space-y-6 w-full">
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-full max-w-md h-12" />
            <Skeleton className="w-full max-w-sm h-6" />
            <Skeleton className="w-full h-12 mt-8" />
            <div className="flex gap-4">
              <Skeleton className="w-32 h-12" />
              <Skeleton className="w-32 h-12" />
            </div>
          </div>
          <div className="flex-1 w-full min-h-[360px]">
            <Skeleton className="w-full h-full min-h-[360px] rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
