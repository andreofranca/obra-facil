"use client";

import { FormEvent, useState } from "react";

type ChatFormularioProps = {
  isSubmitting: boolean;
  onSubmit: (mensagem: string) => Promise<void>;
};

export default function ChatFormulario({
  isSubmitting,
  onSubmit,
}: ChatFormularioProps) {
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const mensagemNormalizada = mensagem.trim();

    if (!mensagemNormalizada) {
      return;
    }

    await onSubmit(mensagemNormalizada);
    setMensagem("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor="mensagem"
        className="block text-sm font-medium"
      >
        Nova mensagem
      </label>
      <textarea
        id="mensagem"
        name="mensagem"
        value={mensagem}
        onChange={(event) => setMensagem(event.target.value)}
        className="min-h-28 w-full rounded-md border px-3 py-2 bg-transparent"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
