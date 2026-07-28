import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

export interface OrderTimelineProps {
  status: SolicitacaoServicoStatus;
}

const TIMELINE_STEPS = [
  { id: "ABERTA", label: "Solicitação criada" },
  { id: "EM_ANALISE", label: "Em análise" },
  { id: "ACEITA", label: "Proposta enviada" },
  { id: "EM_EXECUCAO", label: "Em execução" },
  { id: "CONCLUIDA", label: "Concluído" },
] as const;

export function OrderTimeline({ status }: OrderTimelineProps) {
  const isCancelled = status === "CANCELADA";
  
  // Find current index based on status
  let currentIndex = TIMELINE_STEPS.findIndex((s) => s.id === status);
  if (status === "CONCLUIDA") {
    currentIndex = TIMELINE_STEPS.findIndex((s) => s.id === "EM_EXECUCAO");
  }
  if (currentIndex === -1) {
    if (isCancelled) currentIndex = TIMELINE_STEPS.length; // all inactive if we just want to show cancelled
    else currentIndex = 0; // fallback
  }
  
  if (isCancelled) {
    return (
      <div className="p-4 bg-feedback-error/10 border border-feedback-error/20 rounded-lg flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-feedback-error">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold text-feedback-error">Esta solicitação foi cancelada.</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center w-full">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-neutral-border z-0"></div>
        
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          let circleClasses = "w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-300";
          let labelClasses = "mt-2 text-xs font-semibold whitespace-nowrap absolute top-8 left-1/2 transform -translate-x-1/2";
          
          if (isCompleted) {
            circleClasses += " bg-feedback-success text-white";
            labelClasses += " text-feedback-success";
          } else if (isCurrent) {
            circleClasses += " bg-brand-primary text-white ring-4 ring-brand-primary/20";
            labelClasses += " text-brand-primary";
          } else {
            circleClasses += " bg-neutral-surface border-2 border-neutral-border text-neutral-border";
            labelClasses += " text-neutral-text/50";
          }

          // Active progress line is calculated inline in the style prop

          return (
            <div key={step.id} className="relative flex flex-col items-center flex-1">
              {/* Progress bar up to this step */}
              {index > 0 && (
                <div 
                  className="absolute right-[50%] top-1/2 transform -translate-y-1/2 h-1 bg-brand-primary z-0 transition-all duration-500 ease-in-out" 
                  style={{ width: isCompleted || isCurrent ? "100%" : "0%" }}
                />
              )}
              
              <div className={circleClasses}>
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                ) : null}
              </div>
              <span className={labelClasses}>{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="h-8"></div> {/* spacer for absolute labels */}
    </div>
  );
}
