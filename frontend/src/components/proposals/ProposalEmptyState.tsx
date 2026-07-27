import { Card } from "@/components/ui";

interface ProposalEmptyStateProps {
  title?: string;
  message?: string;
}

export function ProposalEmptyState({
  title = "Nenhuma proposta encontrada",
  message = "Ainda não existem propostas para exibir neste momento.",
}: ProposalEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] border-dashed">
      <h3 className="text-lg font-semibold text-neutral-text mb-2">{title}</h3>
      <p className="text-neutral-muted text-sm">{message}</p>
    </Card>
  );
}
