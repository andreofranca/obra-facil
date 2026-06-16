"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type {
  AuthErrorResponse,
  AuthResponse,
  RegisterPayload,
} from "@/types/auth";

const initialForm: RegisterPayload = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function CadastroPage() {
  const [form, setForm] =
    useState<RegisterPayload>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as
        | AuthResponse
        | AuthErrorResponse;

      if (!response.ok) {
        setErrorMessage(
          "error" in data
            ? data.error
            : "Não foi possível criar o cadastro"
        );
        return;
      }

      window.location.href = "/meus-pedidos";
    } catch {
      setErrorMessage("Erro inesperado ao criar cadastro");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-10">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-6">Cadastro</h1>

        <form
          onSubmit={handleSubmit}
          className="border rounded-lg p-6 shadow space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-2"
            >
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  phone: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Cadastrando..." : "Criar conta"}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
