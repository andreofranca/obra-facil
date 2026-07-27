import { OrderCard } from "./OrderCard";
import { OrdersEmptyState } from "./OrdersEmptyState";
import type { SolicitacaoServicoResumo } from "@/types/solicitacao";

export interface OrdersListProps {
  solicitacoes: SolicitacaoServicoResumo[];
}

export function OrdersList({ solicitacoes }: OrdersListProps) {
  if (!solicitacoes || solicitacoes.length === 0) {
    return <OrdersEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {solicitacoes.map((solicitacao) => (
        <OrderCard key={solicitacao.id} solicitacao={solicitacao} />
      ))}
    </div>
  );
}
