import React from "react";
import { Skeleton } from "@/components/ui";

export function ProfessionalSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 bg-neutral-surface relative mb-16 rounded-b-3xl border border-neutral-border border-t-0 shadow-soft">
        <div className="absolute -bottom-12 left-8 md:left-12 flex gap-6 items-end">
          <Skeleton className="w-32 h-32 rounded-full border-4 border-neutral-background shadow-soft" />
          <div className="mb-4 space-y-3 hidden md:block">
            <Skeleton className="h-8 w-64 rounded-md bg-neutral-border/50" />
            <Skeleton className="h-5 w-48 rounded-md bg-neutral-border/50" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Mobile Text Skeleton (Shown only on small screens) */}
          <div className="md:hidden space-y-3 mt-4">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-5 w-48 rounded-md" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-40 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-neutral-surface rounded-3xl border border-neutral-border p-6 shadow-soft space-y-6">
            <Skeleton className="h-6 w-1/2 rounded-md" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
