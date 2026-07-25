import React from "react";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function StepNavigation({
  currentStep,
  totalSteps,
  isNextDisabled = false,
  isSubmitting = false,
  onNext,
  onBack,
  onSubmit,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-border/50">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1 || isSubmitting}
        className={currentStep === 1 ? "invisible" : ""}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {currentStep < totalSteps - 1 ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
        >
          Avançar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : currentStep === totalSteps - 1 ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isNextDisabled || isSubmitting}
          className="bg-brand-primary text-neutral-white shadow-elevated"
        >
          {isSubmitting ? "Enviando..." : "Confirmar Solicitação"}
          {!isSubmitting && <Check className="w-4 h-4 ml-2" />}
        </Button>
      ) : null}
    </div>
  );
}
