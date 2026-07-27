"use client";

import { useEffect, useState } from "react";
import { ProposalList, ProposalForm, ProposalDetails } from "@/components/proposals";
import type { PropostaResumo, CriarPropostaPayload } from "@/types/proposta";
import { Button } from "@/components/ui";

interface ProposalsSectionProps {
  solicitacaoId?: string;
  userRole: "CLIENT" | "PROFESSIONAL";
}

export function ProposalsSection({ solicitacaoId, userRole }: ProposalsSectionProps) {
  const [propostas, setPropostas] = useState<PropostaResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState<PropostaResumo | null>(null);

  const fetchPropostas = async (currentSolicitacaoId?: string) => {
    try {
      setIsLoading(true);
      const url = currentSolicitacaoId ? `/api/propostas?solicitacaoId=${currentSolicitacaoId}` : `/api/propostas`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setPropostas(data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar propostas", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const url = solicitacaoId ? `/api/propostas?solicitacaoId=${solicitacaoId}` : `/api/propostas`;
        const response = await fetch(url);
        const data = await response.json();
        if (mounted && data.success) {
          setPropostas(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar propostas", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [solicitacaoId]);

  const handleCreate = async (formData: { valor: string; prazoDias: string; mensagem: string }) => {
    try {
      if (!solicitacaoId) return;
      const payload: Omit<CriarPropostaPayload, "profissionalId"> = {
        solicitacaoId,
        valor: formData.valor,
        prazoDias: Number(formData.prazoDias),
        mensagem: formData.mensagem,
      };

      const response = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsCreating(false);
        fetchPropostas();
      } else {
        alert("Erro ao criar proposta.");
      }
    } catch (err) {
      alert("Erro ao criar proposta.");
    }
  };

  const handleAction = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/propostas/${id}`, {
        method: "PATCH", // assuming PATCH or PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        if (selectedProposta && selectedProposta.id === id) {
          setSelectedProposta({ ...selectedProposta, status: status as PropostaResumo["status"] });
        }
        fetchPropostas();
      } else {
        alert("Erro ao atualizar proposta.");
      }
    } catch (err) {
      alert("Erro ao atualizar proposta.");
    }
  };

  if (selectedProposta) {
    const actions = (
      <>
        <Button variant="outline" onClick={() => setSelectedProposta(null)}>
          Voltar
        </Button>
        {userRole === "CLIENT" && selectedProposta.status === "PENDENTE" && (
          <>
            <Button variant="danger" onClick={() => handleAction(selectedProposta.id, "RECUSADA")}>
              Recusar
            </Button>
            <Button variant="primary" onClick={() => handleAction(selectedProposta.id, "ACEITA")}>
              Aceitar
            </Button>
          </>
        )}
        {userRole === "PROFESSIONAL" && selectedProposta.status === "PENDENTE" && (
          <Button variant="danger" onClick={() => handleAction(selectedProposta.id, "CANCELADA")}>
            Cancelar Proposta
          </Button>
        )}
      </>
    );

    return <ProposalDetails proposta={selectedProposta} userRole={userRole} actions={actions} />;
  }

  if (isCreating) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-border">
        <h3 className="text-lg font-bold mb-4">Nova Proposta</h3>
        <ProposalForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      </div>
    );
  }

  const renderActions = (proposta: PropostaResumo) => (
    <Button variant="outline" size="sm" onClick={() => setSelectedProposta(proposta)}>
      Ver Detalhes
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-neutral-text">Propostas</h2>
        {userRole === "PROFESSIONAL" && (
          <Button onClick={() => setIsCreating(true)}>Enviar Proposta</Button>
        )}
      </div>
      <ProposalList
        propostas={propostas}
        isLoading={isLoading}
        userRole={userRole}
        renderActions={renderActions}
        emptyStateTitle="Nenhuma proposta"
        emptyStateMessage={userRole === "CLIENT" ? "Este pedido ainda não recebeu propostas." : "Você ainda não enviou propostas para este pedido."}
      />
    </div>
  );
}
