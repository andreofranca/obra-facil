import React from "react";
import { Skeleton } from "./Skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { ListSkeleton } from "./ListSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-64 h-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-40 h-6 mb-4" />
          <ListSkeleton count={4} />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-32 h-6 mb-4" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
