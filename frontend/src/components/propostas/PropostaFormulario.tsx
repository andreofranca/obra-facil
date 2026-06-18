"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CriarPropostaPayload } from "@/types/proposta";

type PropostaFormularioProps = {
  solicitacaoId: string;
  profissionalId: string;
};

type FormState = {
  valor: string;
  prazoDias: string;
  mensagem: string;
};

type SubmitStatus =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialForm: FormState = {
  valor: "",
  prazoDias: "",
  mensagem: "",
};

export default function PropostaFormulario({
  solicitacaoId,
  profissionalId,
}: PropostaFormularioProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const payload: CriarPropostaPayload = {
      solicitacaoId,
      profissionalId,
      valor: form.valor,
      prazoDias: Number(form.prazoDias),
      mensagem: form.mensagem,
    };

    try {
      const response = await fetch("/api/propostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as {
          error?: string;
        };

        setStatus({
          type: "error",
          message:
            data.error || "Não foi possível enviar a proposta.",
        });
        return;
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Proposta enviada com sucesso.",
      });
      router.refresh();
    } catch {
      setStatus({
        type: "error",
        message: "Erro inesperado ao enviar a proposta.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 border rounded-lg p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">
        Enviar Proposta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium mb-2"
            >
              Valor
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              value={form.valor}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  valor: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="prazoDias"
              className="block text-sm font-medium mb-2"
            >
              Prazo em dias
            </label>
            <input
              id="prazoDias"
              name="prazoDias"
              type="number"
              min="1"
              step="1"
              value={form.prazoDias}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  prazoDias: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="mensagemProposta"
            className="block text-sm font-medium mb-2"
          >
            Mensagem
          </label>
          <textarea
            id="mensagemProposta"
            name="mensagem"
            value={form.mensagem}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                mensagem: event.target.value,
              }))
            }
            className="min-h-28 w-full rounded-md border px-3 py-2 bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar Proposta"}
        </button>

        {status.message && (
          <p
            className={
              status.type === "success"
                ? "text-sm text-green-600"
                : "text-sm text-red-600"
            }
          >
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}
