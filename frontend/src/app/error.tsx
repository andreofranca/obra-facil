"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
          Ocorreu um erro inesperado
        </h1>
        <p className="text-neutral-muted max-w-md mx-auto mb-8">
          Infelizmente encontramos um problema técnico ao processar sua requisição.
        </p>
        <Button onClick={() => reset()} variant="primary" size="lg">
          Tentar Novamente
        </Button>
      </main>
    </div>
  );
}
