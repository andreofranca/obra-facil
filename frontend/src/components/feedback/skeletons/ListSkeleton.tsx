import React from "react";
import { Skeleton } from "./Skeleton";

interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-neutral-surface border border-neutral-border rounded-xl">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/4 h-3" />
          </div>
          <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
