"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Integração futura com ferramentas de observabilidade (ex: Sentry)
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
        !
      </div>
      <h2 className="text-neutral-text font-sans text-3xl font-bold leading-tight mb-4">
        Ops! Algo deu errado.
      </h2>
      <p className="text-neutral-muted font-sans text-lg leading-relaxed mb-8 max-w-[500px]">
        Não foi possível carregar as informações. Verifique sua conexão ou tente novamente.
      </p>
      <Button onClick={() => reset()} size="lg">
        Tentar Novamente
      </Button>
    </div>
  );
}
