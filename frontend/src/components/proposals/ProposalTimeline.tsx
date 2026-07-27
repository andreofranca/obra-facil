import { PropostaStatus } from "./ProposalStatusBadge";

interface ProposalTimelineProps {
  status: PropostaStatus;
  createdAt: string;
}

const timelineSteps = [
  { id: "PENDENTE", label: "Criada" },
  { id: "VISUALIZADA", label: "Visualizada" },
  { id: "ACEITA", label: "Aceita" },
  { id: "EM_ANDAMENTO", label: "Em andamento" },
  { id: "CONCLUIDA", label: "Concluída" },
];

export function ProposalTimeline({ status }: ProposalTimelineProps) {
  // Placeholder logic since the API doesn't have a real history yet.
  const isCanceledOrExpired = status === "CANCELADA" || status === "EXPIRADA";
  const isRejected = status === "RECUSADA";
  const isAccepted = status === "ACEITA";

  const getStepStatus = (stepId: string) => {
    if (isCanceledOrExpired || isRejected) {
      if (stepId === "PENDENTE") return "completed";
      return "upcoming";
    }

    if (isAccepted) {
      if (["PENDENTE", "VISUALIZADA", "ACEITA"].includes(stepId)) return "completed";
      return "upcoming";
    }

    // Default to Pendente
    if (stepId === "PENDENTE") return "completed";
    return "upcoming";
  };

  return (
    <div className="flex flex-col w-full py-4">
      <h4 className="text-sm font-semibold text-neutral-text mb-4">Linha do Tempo</h4>
      <div className="relative flex justify-between items-center w-full">
        {/* Line placeholder */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-neutral-border -z-10" />
        
        {timelineSteps.map((step) => {
          const stepStatus = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-neutral-surface px-2">
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                  ${stepStatus === "completed" 
                    ? "bg-brand-primary border-brand-primary" 
                    : "bg-neutral-white border-neutral-border"
                  }
                `}
              />
              <span className={`text-xs ${stepStatus === "completed" ? "text-neutral-text font-medium" : "text-neutral-muted"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {(isCanceledOrExpired || isRejected) && (
        <div className="mt-4 p-3 bg-[#FDECEC] rounded-lg">
          <p className="text-sm text-feedback-error font-medium">
            Proposta {status === "RECUSADA" ? "recusada pelo cliente" : status.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}
