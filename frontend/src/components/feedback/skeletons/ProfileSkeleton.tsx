import React from "react";
import { Skeleton } from "./Skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-neutral-surface border border-neutral-border p-8 rounded-3xl">
      <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
      <div className="flex-1 w-full space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-1/3 h-8" />
          <Skeleton className="w-1/4 h-4" />
        </div>
        <div className="flex gap-4 pt-4">
          <Skeleton className="w-24 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
