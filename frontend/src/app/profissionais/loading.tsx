import { Skeleton } from "@/components/ui";

export default function ProfissionaisLoading() {
  return (
    <main className="p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <Skeleton className="w-64 h-10" />
        <Skeleton className="w-full md:w-80 h-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-neutral-border rounded-lg p-4 shadow-sm flex flex-col gap-4 min-h-[200px]">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
            <Skeleton className="w-full h-4 mt-2" />
            <Skeleton className="w-5/6 h-4" />
            <div className="mt-auto flex justify-between items-center pt-4">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
