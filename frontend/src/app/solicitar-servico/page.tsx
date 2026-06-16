"use client";

import { FormEvent, useState } from "react";
import type {
  CriarSolicitacaoServicoPayload,
  SolicitacaoServicoCriada,
} from "@/types/solicitacao";

type FormStatus =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialForm: CriarSolicitacaoServicoPayload = {
  titulo: "",
  descricao: "",
  clienteId: "",
};

export default function SolicitarServicoPage() {
  const [form, setForm] =
    useState<CriarSolicitacaoServicoPayload>(initialForm);
  const [status, setStatus] = useState<FormStatus>({
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

    try {
      const response = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as
        | SolicitacaoServicoCriada
        | { error: string };

      if (!response.ok) {
        const errorMessage =
          "error" in data
            ? data.error
            : "Não foi possível criar a solicitação";

        setStatus({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      const solicitacao = data as SolicitacaoServicoCriada;

      setForm(initialForm);
      setStatus({
        type: "success",
        message: `Solicitação criada com sucesso. Protocolo: ${solicitacao.id}`,
      });
    } catch {
      setStatus({
        type: "error",
        message: "Erro inesperado ao enviar a solicitação",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">
          Solicitar Serviço
        </h1>

        <form
          onSubmit={handleSubmit}
          className="border rounded-lg p-6 shadow space-y-5"
        >
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium mb-2"
            >
              Título
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  titulo: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              placeholder="Ex.: Reforma do banheiro"
              required
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium mb-2"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  descricao: event.target.value,
                }))
              }
              className="min-h-36 w-full rounded-md border px-3 py-2 bg-transparent"
              placeholder="Descreva o serviço, local e detalhes importantes."
              required
            />
          </div>

          <div>
            <label
              htmlFor="clienteId"
              className="block text-sm font-medium mb-2"
            >
              ID do cliente
            </label>
            <input
              id="clienteId"
              name="clienteId"
              type="text"
              value={form.clienteId}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  clienteId: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              placeholder="Cole o ID do cliente cadastrado"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Enviando..."
              : "Criar Solicitação"}
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
      </div>
    </main>
  );
}
