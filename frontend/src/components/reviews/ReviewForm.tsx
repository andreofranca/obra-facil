"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RatingStars } from "./RatingStars";

interface ReviewFormProps {
  solicitacaoId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ solicitacaoId, onSuccess }: ReviewFormProps) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0) {
      setError("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitacaoId, nota, comentario }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao enviar avaliação.");
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-neutral-border p-6 rounded-lg bg-neutral-surface">
      <h3 className="text-lg font-semibold text-neutral-dark">Avaliar Profissional</h3>
      <p className="text-sm text-neutral-text">
        Como foi o serviço? Sua avaliação ajuda outros clientes a encontrarem bons profissionais.
      </p>

      <div className="flex flex-col gap-2 my-2">
        <label className="text-sm font-medium text-neutral-dark">Nota (obrigatório)</label>
        <RatingStars value={nota} onChange={setNota} interactive size="lg" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comentario" className="text-sm font-medium text-neutral-dark">
          Comentário (opcional)
        </label>
        <textarea
          id="comentario"
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escreva sobre sua experiência..."
          className="w-full px-3 py-2 border border-neutral-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          maxLength={500}
        />
        <span className="text-xs text-neutral-text text-right">{comentario.length}/500</span>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || nota === 0}
        className="mt-2 w-full md:w-auto self-end px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </button>
    </form>
  );
}
