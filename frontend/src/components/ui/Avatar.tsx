import React from "react";

export interface AvatarProps {
  initials: string;
  className?: string;
}

export function Avatar({ initials, className = "" }: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-primary text-white font-bold tracking-widest ${className}`}
    >
      {initials.substring(0, 2).toUpperCase()}
    </div>
  );
}
