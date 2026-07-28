import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-neutral-border/50 rounded-md ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
