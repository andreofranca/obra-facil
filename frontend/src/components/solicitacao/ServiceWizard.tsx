"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui";
import { WizardStep } from "./WizardStep";
import { StepNavigation } from "./StepNavigation";
import { ServiceSummary } from "./ServiceSummary";
import { RequestSuccess } from "./RequestSuccess";
import { AlertCircle } from "lucide-react";
import type { CriarSolicitacaoServicoPayload, SolicitacaoServicoCriada } from "@/types/solicitacao";

export function ServiceWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profissionalId] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("profissionalId") || "";
    }
    return "";
  });
  
  // Dados do formulário divididos pelo Wizard
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [dataPreferencial, setDataPreferencial] = useState("");
  
  // Estado de controle
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [protocoloId, setProtocoloId] = useState("");

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    // Concatenação inteligente para respeitar a API antiga sem perder os dados da nova UX
    const descricaoFinal = `${descricao}\n\nLocal: ${localizacao || "Não informado"}\nData Preferencial: ${dataPreferencial || "A combinar"}`.trim();

    const payload: CriarSolicitacaoServicoPayload = {
      titulo,
      descricao: descricaoFinal,
      profissionalId,
      clienteId: "", // Será preenchido pela sessão no backend
    };

    try {
      const response = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as SolicitacaoServicoCriada | { error: string };

      if (!response.ok) {
        setError("error" in data ? data.error : "Não foi possível criar a solicitação.");
        setIsSubmitting(false);
        return;
      }

      setProtocoloId((data as SolicitacaoServicoCriada).id);
      setCurrentStep(6); // Sucesso
    } catch (err) {
      setError("Ocorreu um erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 6) {
    return <RequestSuccess protocolo={protocoloId} />;
  }

  // Validações por passo
  const isStep1Valid = titulo.trim().length > 3;
  const isStep2Valid = descricao.trim().length > 10;

  const getIsNextDisabled = () => {
    switch (currentStep) {
      case 1: return !isStep1Valid;
      case 2: return !isStep2Valid;
      default: return false;
    }
  };

  return (
    <div className="bg-neutral-surface border border-neutral-border p-6 md:p-10 rounded-3xl shadow-soft">
      {/* Indicador de progresso sutil */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step} 
            className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
              step <= currentStep ? "bg-brand-primary" : "bg-neutral-border"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-feedback-error/10 border border-feedback-error/20 rounded-xl flex items-start gap-3 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-feedback-error flex-none mt-0.5" />
          <p className="text-feedback-error text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Passo 1 */}
      <WizardStep 
        isActive={currentStep === 1}
        title="O que você precisa?"
        description="Dê um título curto e objetivo para o serviço que você está procurando."
      >
        <div>
          <label htmlFor="titulo" className="block text-sm font-bold text-neutral-text mb-2">
            Título do Serviço <span className="text-feedback-error">*</span>
          </label>
          <Input
            id="titulo"
            placeholder="Ex.: Instalação de piso vinílico, Pintura externa..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full text-lg py-6"
            autoFocus
          />
          <p className="text-xs text-neutral-muted mt-2 font-medium">
            {titulo.length}/100 caracteres. (Mínimo de 4)
          </p>
        </div>
      </WizardStep>

      {/* Passo 2 */}
      <WizardStep 
        isActive={currentStep === 2}
        title="Detalhes do serviço"
        description="Quanto mais detalhes você fornecer, mais fácil será para o profissional entender a sua necessidade."
      >
        <div>
          <label htmlFor="descricao" className="block text-sm font-bold text-neutral-text mb-2">
            Descrição <span className="text-feedback-error">*</span>
          </label>
          <textarea
            id="descricao"
            placeholder="Descreva o tamanho do local, condições atuais, materiais (se houver), e o que exatamente precisa ser feito."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full min-h-[160px] rounded-xl border border-neutral-border px-4 py-3 bg-neutral-background text-neutral-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors resize-y"
            autoFocus
          />
          <p className="text-xs text-neutral-muted mt-2 font-medium">
            Mínimo de 10 caracteres.
          </p>
        </div>
      </WizardStep>

      {/* Passo 3 */}
      <WizardStep 
        isActive={currentStep === 3}
        title="Localização"
        description="Onde o serviço será realizado? (Opcional)"
      >
        <div>
          <label htmlFor="localizacao" className="block text-sm font-bold text-neutral-text mb-2">
            Endereço ou Bairro/Cidade
          </label>
          <Input
            id="localizacao"
            placeholder="Ex.: Bairro Pinheiros, São Paulo - SP"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            className="w-full py-5"
            autoFocus
          />
          <p className="text-xs text-neutral-muted mt-2">
            Pode ser apenas a região. O endereço exato você pode passar depois.
          </p>
        </div>
      </WizardStep>

      {/* Passo 4 */}
      <WizardStep 
        isActive={currentStep === 4}
        title="Data"
        description="Qual é a sua preferência de data para o serviço? (Opcional)"
      >
        <div>
          <label htmlFor="dataPreferencial" className="block text-sm font-bold text-neutral-text mb-2">
            Data ou Período
          </label>
          <Input
            id="dataPreferencial"
            placeholder="Ex.: Próxima semana, Dia 15/10, Urgente..."
            value={dataPreferencial}
            onChange={(e) => setDataPreferencial(e.target.value)}
            className="w-full py-5"
            autoFocus
          />
        </div>
      </WizardStep>

      {/* Passo 5 */}
      <WizardStep 
        isActive={currentStep === 5}
        title="Revise sua solicitação"
        description="Confira os dados antes de enviar para o profissional."
      >
        <ServiceSummary 
          titulo={titulo}
          descricao={descricao}
          localizacao={localizacao}
          dataPreferencial={dataPreferencial}
        />
        <div className="mt-6 bg-feedback-info/10 border border-feedback-info/20 p-4 rounded-xl">
          <p className="text-sm text-feedback-info font-medium">
            Ao confirmar, o profissional será notificado e poderá aceitar sua solicitação. O contato é totalmente gratuito.
          </p>
        </div>
      </WizardStep>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
        isNextDisabled={getIsNextDisabled()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
