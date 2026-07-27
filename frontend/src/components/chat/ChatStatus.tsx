interface ChatStatusProps {
  status: "idle" | "loading" | "syncing" | "error";
  errorMessage?: string;
}

export function ChatStatus({ status, errorMessage }: ChatStatusProps) {
  if (status === "idle" || status === "loading") return null;

  return (
    <div className="flex items-center justify-center py-2 px-4 text-xs font-medium w-full absolute top-0 left-0 z-10">
      {status === "syncing" && (
        <span className="bg-brand-secondary/10 text-brand-secondary px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border-2 border-brand-secondary border-t-transparent animate-spin" />
          Sincronizando...
        </span>
      )}
      
      {status === "error" && (
        <span className="bg-danger/10 text-danger px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
          Falha na sincronização. {errorMessage}
        </span>
      )}
    </div>
  );
}
