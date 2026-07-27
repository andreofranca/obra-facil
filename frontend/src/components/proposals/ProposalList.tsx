import { ReactNode } from "react";
import type { PropostaResumo } from "@/types/proposta";
import { ProposalCard } from "./ProposalCard";
import { ProposalEmptyState } from "./ProposalEmptyState";
import { ProposalSkeleton } from "./ProposalSkeleton";

interface ProposalListProps {
  propostas: PropostaResumo[];
  isLoading?: boolean;
  userRole?: "CLIENT" | "PROFESSIONAL";
  renderActions?: (proposta: PropostaResumo) => ReactNode;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export function ProposalList({
  propostas,
  isLoading,
  userRole = "CLIENT",
  renderActions,
  emptyStateTitle,
  emptyStateMessage,
}: ProposalListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <ProposalSkeleton />
        <ProposalSkeleton />
        <ProposalSkeleton />
      </div>
    );
  }

  if (!propostas || propostas.length === 0) {
    return (
      <ProposalEmptyState 
        title={emptyStateTitle} 
        message={emptyStateMessage} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {propostas.map((proposta) => (
        <ProposalCard 
          key={proposta.id} 
          proposta={proposta} 
          userRole={userRole}
          actions={renderActions ? renderActions(proposta) : undefined}
        />
      ))}
    </div>
  );
}
