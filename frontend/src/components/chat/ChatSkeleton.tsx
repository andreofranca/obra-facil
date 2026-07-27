import { Skeleton } from "@/components/ui/Skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-[70%]">
          <Skeleton className="h-16 rounded-2xl rounded-tl-sm w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      <div className="flex gap-3 flex-row-reverse">
        <div className="flex flex-col gap-2 w-full max-w-[70%] items-end">
          <Skeleton className="h-12 rounded-2xl rounded-tr-sm w-3/4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-[70%]">
          <Skeleton className="h-20 rounded-2xl rounded-tl-sm w-5/6" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
