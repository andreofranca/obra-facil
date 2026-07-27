import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface CompletionTimelineProps {
  status: SolicitacaoServicoStatus;
}

export function CompletionTimeline({ status }: CompletionTimelineProps) {
  const steps = [
    { id: "EM_ANDAMENTO", label: "Em Andamento" },
    { id: "AGUARDANDO_CONFIRMACAO_CLIENTE", label: "Finalizado pelo Profissional" },
    { id: "CONCLUIDA", label: "Concluído pelo Cliente" }
  ];

  let currentIndex = 0;
  if (status === "AGUARDANDO_CONFIRMACAO_CLIENTE") currentIndex = 1;
  if (status === "CONCLUIDA") currentIndex = 2;

  // Se for antes de em andamento, não mostrar
  if (!["EM_ANDAMENTO", "AGUARDANDO_CONFIRMACAO_CLIENTE", "CONCLUIDA"].includes(status)) {
    return null;
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-border z-0 rounded-full" />
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-brand-primary text-white" 
                    : "bg-neutral-surface border-2 border-neutral-border text-neutral-text"
                } ${isCurrent ? "ring-4 ring-brand-primary/20" : ""}`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-xs md:text-sm font-medium hidden sm:block ${
                isCompleted ? "text-neutral-dark" : "text-neutral-text"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
