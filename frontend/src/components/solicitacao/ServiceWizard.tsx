"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WizardStep } from "./WizardStep";
import { StepNavigation } from "./StepNavigation";
import { ServiceSummary } from "./ServiceSummary";
import { RequestSuccess } from "./RequestSuccess";
import { AlertCircle } from "lucide-react";
import { TextInput } from "@/components/form/TextInput";
import { Textarea } from "@/components/form/Textarea";
import { CepInput } from "@/components/form/CepInput";
import { DateInput } from "@/components/form/DateInput";
import { LIMITS } from "@/lib/constants/limits";
import { isFutureOrTodayDate } from "@/lib/validation/date";
import { addressToLegacyString } from "@/lib/mappers/address";
import type { Address } from "@/types/address";
import type { CriarSolicitacaoServicoPayload, SolicitacaoServicoCriada } from "@/types/solicitacao";

const wizardSchema = z.object({
  titulo: z.string().min(4, "No mínimo 4 caracteres").max(LIMITS.NAME_MAX, "Título muito longo"),
  descricao: z.string().min(10, "Detalhe mais o que você precisa").max(LIMITS.DESCRIPTION_MAX, "Descrição muito longa"),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  dataPreferencial: z.string().refine((val) => !val || isFutureOrTodayDate(val), "Data inválida ou no passado").optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export function ServiceWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profissionalId] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("profissionalId") || "";
    }
    return "";
  });
  
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");
  const [protocoloId, setProtocoloId] = useState("");

  const totalSteps = 6;

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors }
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      titulo: "", descricao: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "", dataPreferencial: ""
    }
  });

  const watchAllFields = useWatch({ control });

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await trigger("titulo");
    else if (currentStep === 2) isValid = await trigger("descricao");
    else if (currentStep === 3) isValid = await trigger(["cep", "logradouro", "numero", "bairro", "cidade", "uf"]);
    else if (currentStep === 4) isValid = await trigger("dataPreferencial");
    else isValid = true;
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const onSubmitForm = async (data: WizardFormData) => {
    setIsSubmittingForm(true);
    setError("");

    const address: Address = {
      cep: data.cep || "",
      logradouro: data.logradouro || "",
      numero: data.numero || "",
      bairro: data.bairro || "",
      cidade: data.cidade || "",
      uf: data.uf || "",
    };

    const localizacaoString = addressToLegacyString(address);
    const descricaoFinal = `${data.descricao}\n\nLocal: ${localizacaoString || "Não informado"}\nData Preferencial: ${data.dataPreferencial || "A combinar"}`.trim();

    const payload: CriarSolicitacaoServicoPayload = {
      titulo: data.titulo,
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

      const responseData = (await response.json()) as SolicitacaoServicoCriada | { error: string };

      if (!response.ok) {
        setError("error" in responseData ? responseData.error : "Não foi possível criar a solicitação.");
        setIsSubmittingForm(false);
        return;
      }

      setProtocoloId((responseData as SolicitacaoServicoCriada).id);
      setCurrentStep(6);
    } catch {
      setError("Ocorreu um erro de conexão. Tente novamente.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (currentStep === 6) {
    return <RequestSuccess protocolo={protocoloId} />;
  }

  const getIsNextDisabled = () => {
    switch (currentStep) {
      case 1: return (watchAllFields.titulo?.length || 0) < 4;
      case 2: return (watchAllFields.descricao?.length || 0) < 10;
      default: return false;
    }
  };

  return (
    <div className="bg-neutral-surface border border-neutral-border p-6 md:p-10 rounded-3xl shadow-soft">
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

      <form onSubmit={(e) => { e.preventDefault(); }}>
        {/* Passo 1 */}
        {currentStep === 1 && (
          <WizardStep 
            isActive={true}
            title="O que você precisa?"
            description="Dê um título curto e objetivo para o serviço que você está procurando."
          >
            <TextInput
              id="titulo"
              label="Título do Serviço *"
              placeholder="Ex.: Instalação de piso vinílico, Pintura externa..."
              error={errors.titulo?.message}
              {...register("titulo")}
              autoFocus
            />
            <p className="text-xs text-neutral-muted mt-2 font-medium">
              Mínimo de 4 caracteres.
            </p>
          </WizardStep>
        )}

        {/* Passo 2 */}
        {currentStep === 2 && (
          <WizardStep 
            isActive={true}
            title="Detalhes do serviço"
            description="Quanto mais detalhes você fornecer, mais fácil será para o profissional entender a sua necessidade."
          >
            <Textarea
              id="descricao"
              label="Descrição *"
              placeholder="Descreva o tamanho do local, condições atuais, materiais (se houver), e o que exatamente precisa ser feito."
              error={errors.descricao?.message}
              {...register("descricao")}
              className="min-h-[160px]"
              autoFocus
            />
            <p className="text-xs text-neutral-muted mt-2 font-medium">
              Mínimo de 10 caracteres.
            </p>
          </WizardStep>
        )}

        {/* Passo 3 */}
        {currentStep === 3 && (
          <WizardStep 
            isActive={true}
            title="Localização"
            description="Onde o serviço será realizado? (Opcional)"
          >
            <div className="space-y-4">
              <CepInput
                id="cep"
                label="CEP"
                placeholder="00000-000"
                error={errors.cep?.message}
                {...register("cep")}
                onCepFetched={(data: Address) => {
                  setValue("logradouro", data.logradouro);
                  setValue("bairro", data.bairro);
                  setValue("cidade", data.cidade);
                  setValue("uf", data.uf);
                }}
                autoFocus
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput id="logradouro" label="Endereço" {...register("logradouro")} />
                <TextInput id="numero" label="Número" {...register("numero")} />
                <TextInput id="bairro" label="Bairro" {...register("bairro")} />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput id="cidade" label="Cidade" {...register("cidade")} />
                  <TextInput id="uf" label="UF" {...register("uf")} />
                </div>
              </div>
            </div>
          </WizardStep>
        )}

        {/* Passo 4 */}
        {currentStep === 4 && (
          <WizardStep 
            isActive={true}
            title="Data"
            description="Qual é a sua preferência de data para o serviço? (Opcional)"
          >
            <DateInput
              id="dataPreferencial"
              label="Data ou Período"
              placeholder="DD/MM/AAAA"
              error={errors.dataPreferencial?.message}
              {...register("dataPreferencial")}
              autoFocus
            />
          </WizardStep>
        )}

        {/* Passo 5 */}
        {currentStep === 5 && (
          <WizardStep 
            isActive={true}
            title="Revise sua solicitação"
            description="Confira os dados antes de enviar para o profissional."
          >
            <ServiceSummary 
              titulo={watchAllFields.titulo || ""}
              descricao={watchAllFields.descricao || ""}
              localizacao={addressToLegacyString({
                cep: watchAllFields.cep || "",
                logradouro: watchAllFields.logradouro || "",
                numero: watchAllFields.numero || "",
                bairro: watchAllFields.bairro || "",
                cidade: watchAllFields.cidade || "",
                uf: watchAllFields.uf || "",
              })}
              dataPreferencial={watchAllFields.dataPreferencial || ""}
            />
            <div className="mt-6 bg-feedback-info/10 border border-feedback-info/20 p-4 rounded-xl">
              <p className="text-sm text-feedback-info font-medium">
                Ao confirmar, o profissional será notificado e poderá aceitar sua solicitação. O contato é totalmente gratuito.
              </p>
            </div>
          </WizardStep>
        )}
      </form>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit(onSubmitForm)}
        isNextDisabled={getIsNextDisabled()}
        isSubmitting={isSubmittingForm}
      />
    </div>
  );
}
