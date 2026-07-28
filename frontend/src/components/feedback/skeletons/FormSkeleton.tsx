import React from "react";
import { Skeleton } from "./Skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-6 bg-neutral-surface p-6 md:p-10 rounded-3xl border border-neutral-border shadow-soft">
      <div className="space-y-2 mb-8">
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-3/4 h-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="w-1/5 h-4" />
        <Skeleton className="w-full h-32 rounded-xl" />
      </div>

      <div className="pt-4 flex justify-end">
        <Skeleton className="w-32 h-12 rounded-xl" />
      </div>
    </div>
  );
}
