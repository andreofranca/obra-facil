"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type {
  AuthErrorResponse,
  AuthResponse,
  LoginPayload,
} from "@/types/auth";

const initialForm: LoginPayload = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginPayload>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
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
          "error" in data ? data.error : "Não foi possível entrar"
        );
        return;
      }

      window.location.href = "/meus-pedidos";
    } catch {
      setErrorMessage("Erro inesperado ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-10">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-6">Entrar</h1>

        <form
          onSubmit={handleSubmit}
          className="border rounded-lg p-6 shadow space-y-5"
        >
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
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-blue-600">
            Criar cadastro
          </Link>
        </p>
      </div>
    </main>
  );
}
