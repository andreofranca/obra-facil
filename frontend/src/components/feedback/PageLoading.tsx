import React from "react";

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Carregando..." }: PageLoadingProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center w-full min-h-[50vh] p-8"
      aria-busy="true"
      aria-live="polite"
      role="progressbar"
    >
      <div className="w-10 h-10 border-4 border-neutral-border border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-neutral-muted text-sm font-medium">
        {message}
      </p>
    </div>
  );
}
