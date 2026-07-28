"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CompletionStatusBadge } from "./CompletionStatusBadge";
import { CompletionConfirmationDialog } from "./CompletionConfirmationDialog";
import type { SolicitacaoServicoStatus } from "@/types/solicitacao";

interface ServiceCompletionCardProps {
  solicitacaoId: string;
  status: SolicitacaoServicoStatus;
  role: "CLIENT" | "PROFESSIONAL";
}

export function ServiceCompletionCard({
  solicitacaoId,
  status,
  role
}: ServiceCompletionCardProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regras de visibilidade
  const isProfessionalAndCanFinish = role === "PROFESSIONAL" && status === "EM_EXECUCAO";
  const isClientAndCanConfirm = role === "CLIENT" && status === "CONCLUIDA";
  
  const showCard = isProfessionalAndCanFinish || isClientAndCanConfirm || status === "CONCLUIDA";

  if (!showCard) return null;

  const handleAction = async () => {
    setIsSubmitting(true);
    
    const endpoint = role === "PROFESSIONAL" 
      ? `/api/solicitacoes/${solicitacaoId}/finalizar`
      : `/api/solicitacoes/${solicitacaoId}/confirmar`;
      
    try {
      const response = await fetch(endpoint, { method: "POST" });
      
      if (!response.ok) {
        throw new Error("Erro na requisição");
      }
      
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      alert("Não foi possível processar sua solicitação no momento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogConfig = () => {
    if (role === "PROFESSIONAL") {
      return {
        title: "Marcar como Finalizado?",
        description: "Ao finalizar o serviço, o cliente será notificado para conferir o trabalho e dar o aceite final. Tem certeza que concluiu todas as etapas?",
        confirmLabel: "Sim, finalizei o serviço",
        cancelLabel: "Voltar",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
        )
      };
    }
    
    return {
      title: "Confirmar Conclusão?",
      description: "Ao confirmar, o serviço será encerrado definitivamente e o chat ficará disponível apenas para leitura. Você confirma que o serviço foi entregue com qualidade?",
      confirmLabel: "Sim, confirmo a conclusão",
      cancelLabel: "Cancelar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
        </svg>
      )
    };
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      <Card className="border-brand-primary/20 bg-brand-primary/5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-brand-primary font-bold">Status do Serviço</h3>
          <CompletionStatusBadge status={status} />
        </div>
        <div>
          <div className="flex flex-col gap-4">
            {status === "CONCLUIDA" && (
              <p className="text-sm text-neutral-text">
                O serviço foi entregue e finalizado com sucesso.
                {role === "CLIENT" && " A etapa de avaliação estará disponível em breve!"}
              </p>
            )}
            
            {status === "CONCLUIDA" && role === "PROFESSIONAL" && (
              <p className="text-sm text-neutral-text">
                Você marcou o serviço como finalizado. Agora estamos aguardando o cliente confirmar a conclusão.
              </p>
            )}

            {status === "CONCLUIDA" && role === "CLIENT" && (
              <p className="text-sm text-neutral-text">
                O profissional sinalizou que concluiu o serviço. Verifique se está tudo correto e confirme abaixo para encerrar.
              </p>
            )}

            {isProfessionalAndCanFinish && (
              <p className="text-sm text-neutral-text">
                Quando concluir todas as etapas acordadas, marque o serviço como finalizado para que o cliente possa confirmar a entrega.
              </p>
            )}

            {(isProfessionalAndCanFinish || isClientAndCanConfirm) && (
              <Button 
                variant="primary" 
                className="w-full sm:w-auto"
                onClick={() => setIsDialogOpen(true)}
              >
                {role === "PROFESSIONAL" ? "Marcar Serviço como Finalizado" : "Confirmar Conclusão"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <CompletionConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleAction}
        isSubmitting={isSubmitting}
        {...dialogConfig}
      />
    </>
  );
}
