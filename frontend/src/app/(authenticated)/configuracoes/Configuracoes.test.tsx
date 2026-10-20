import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfiguracoesClient from "./ConfiguracoesClient";
import { AuthSession } from "@/types/auth";

const mockUser: AuthSession = {
  userId: "user-123",
  clienteId: "client-123",
  profissionalId: null,
  name: "João da Silva",
  email: "joao@teste.com",
  role: "CLIENT",
};

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe("UI: ConfiguracoesClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("deve renderizar a tela de configurações com dados da sessão", () => {
    render(<ConfiguracoesClient user={mockUser} />);

    expect(screen.getByText("Configurações da Conta")).toBeInTheDocument();
    expect(screen.getByText("Segurança & Troca de Senha")).toBeInTheDocument();
    expect(screen.getByText(/joao@teste.com/i)).toBeInTheDocument();
    expect(screen.getByText("Encerrar Esta Sessão")).toBeInTheDocument();
  });

  it("deve desabilitar o botão de salvar enquanto os requisitos de senha não forem cumpridos", () => {
    render(<ConfiguracoesClient user={mockUser} />);

    const saveBtn = screen.getByRole("button", { name: /Salvar Nova Senha/i });
    expect(saveBtn).toBeDisabled();

    // Digita senha fraca
    fireEvent.change(screen.getByLabelText("Nova Senha"), {
      target: { value: "fraca" },
    });
    fireEvent.change(screen.getByLabelText("Confirmar Nova Senha"), {
      target: { value: "fraca" },
    });

    expect(saveBtn).toBeDisabled();
  });

  it("deve submeter a troca de senha com sucesso", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { message: "Senha alterada com sucesso" },
      }),
    } as Response);

    render(<ConfiguracoesClient user={mockUser} />);

    fireEvent.change(screen.getByLabelText("Senha Atual"), {
      target: { value: "SenhaAntiga123!" },
    });
    fireEvent.change(screen.getByLabelText("Nova Senha"), {
      target: { value: "NovaSenhaForte123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirmar Nova Senha"), {
      target: { value: "NovaSenhaForte123!" },
    });

    const saveBtn = screen.getByRole("button", { name: /Salvar Nova Senha/i });
    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Senha alterada com sucesso!/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/change-password",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("deve exibir alerta caso a API retorne erro ao alterar senha", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: { message: "A senha atual informada está incorreta" },
      }),
    } as Response);

    render(<ConfiguracoesClient user={mockUser} />);

    fireEvent.change(screen.getByLabelText("Senha Atual"), {
      target: { value: "SenhaErrada123!" },
    });
    fireEvent.change(screen.getByLabelText("Nova Senha"), {
      target: { value: "NovaSenhaForte123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirmar Nova Senha"), {
      target: { value: "NovaSenhaForte123!" },
    });

    const saveBtn = screen.getByRole("button", { name: /Salvar Nova Senha/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("A senha atual informada está incorreta")).toBeInTheDocument();
    });
  });

  it("deve acionar logout e redirecionar ao clicar em Encerrar Sessão", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ConfiguracoesClient user={mockUser} />);

    const logoutBtn = screen.getByRole("button", { name: /Encerrar Esta Sessão/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
