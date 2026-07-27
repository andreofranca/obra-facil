"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";

export interface ProposalFormData {
  valor: string;
  prazoDias: string;
  mensagem: string;
  observacoes?: string;
}

interface ProposalFormProps {
  initialData?: Partial<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProposalForm({ initialData, onSubmit, onCancel, isLoading }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    valor: initialData?.valor || "",
    prazoDias: initialData?.prazoDias || "",
    mensagem: initialData?.mensagem || "",
    observacoes: initialData?.observacoes || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProposalFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ProposalFormData, string>> = {};
    let isValid = true;

    if (!formData.valor || isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
      newErrors.valor = "Informe um valor válido maior que zero.";
      isValid = false;
    }

    if (!formData.prazoDias || isNaN(Number(formData.prazoDias)) || !Number.isInteger(Number(formData.prazoDias)) || Number(formData.prazoDias) <= 0) {
      newErrors.prazoDias = "Informe um prazo válido em dias inteiros.";
      isValid = false;
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = "A descrição/mensagem é obrigatória.";
      isValid = false;
    } else if (formData.mensagem.length < 20) {
      newErrors.mensagem = "A mensagem deve ter pelo menos 20 caracteres.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="valor"
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0"
          placeholder="Ex: 1500.00"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          error={errors.valor}
          disabled={isLoading}
          required
        />
        <Input
          id="prazoDias"
          label="Prazo (Dias)"
          type="number"
          min="1"
          step="1"
          placeholder="Ex: 15"
          value={formData.prazoDias}
          onChange={(e) => setFormData({ ...formData, prazoDias: e.target.value })}
          error={errors.prazoDias}
          disabled={isLoading}
          required
        />
      </div>

      <Textarea
        id="mensagem"
        label="Descrição da Proposta"
        placeholder="Detalhe o que está incluso no seu serviço, materiais, etapas, etc."
        value={formData.mensagem}
        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
        error={errors.mensagem}
        disabled={isLoading}
        required
      />

      <Textarea
        id="observacoes"
        label="Observações Adicionais (Opcional)"
        placeholder="Informações extras, garantias ou condições especiais."
        value={formData.observacoes}
        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        error={errors.observacoes}
        disabled={isLoading}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Enviar Proposta
        </Button>
      </div>
    </form>
  );
}
