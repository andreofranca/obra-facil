"use client";

import { useEffect } from "react";
import { logger } from "@/platform/observability";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Root Layout Error Boundary Caught", {
      module: "NextAppRouter",
      action: "GLOBAL_RENDER_ERROR",
      digest: error.digest,
      errorMessage: error.message,
    });
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Erro Fatal na Aplicação</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Desculpe, ocorreu um erro sistêmico grave.
          </p>
          <button 
            onClick={() => reset()} 
            style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Tentar Restaurar
          </button>
        </div>
      </body>
    </html>
  );
}
