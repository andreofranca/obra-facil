import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "./page";

// Mock do useRouter (Next.js)
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do Fetch nativo
global.fetch = vi.fn();

describe("Integration: LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário corretamente", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Bem-vindo de volta" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Seu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sua senha")).toBeInTheDocument();
  });

  it("deve exibir mensagens de erro do Zod ao submeter campos vazios", async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    
    // Zod errors
    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(screen.getByText("A senha é obrigatória")).toBeInTheDocument();
    });
  });

  it("deve chamar a API e redirecionar em caso de sucesso", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake-token" }),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText("Seu email"), "teste@email.com");
    await userEvent.type(screen.getByPlaceholderText("Sua senha"), "Senha123!");
    
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith("/meus-pedidos");
    });
  });

  it("deve exibir alerta caso a API retorne erro", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Credenciais inválidas" }),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText("Seu email"), "errado@email.com");
    await userEvent.type(screen.getByPlaceholderText("Sua senha"), "SenhaErrada!");
    
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Credenciais inválidas");
    });
  });
});
