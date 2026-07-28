import React from "react";
import { Skeleton } from "./Skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-neutral-surface border border-neutral-border p-6 rounded-2xl shadow-soft">
      <Skeleton className="w-12 h-12 rounded-full mb-4" />
      <Skeleton className="w-3/4 h-5 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-6" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
    </div>
  );
}
