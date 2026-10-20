import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PerfilClient, { PerfilUserData } from "./PerfilClient";

const mockClientUser: PerfilUserData = {
  id: "user-c-1",
  name: "Maria Santos",
  email: "maria@teste.com",
  phone: "(11) 98765-4321",
  role: "CLIENT",
  createdAt: "2026-01-15T10:00:00.000Z",
  cliente: {
    id: "cli-1",
    _count: {
      solicitacoes: 4,
      avaliacoesServico: 2,
      favoritos: 5,
    },
  },
};

const mockProUser: PerfilUserData = {
  id: "user-p-1",
  name: "Carlos Eletricista",
  email: "carlos@teste.com",
  phone: "(11) 91234-5678",
  role: "PROFESSIONAL",
  createdAt: "2026-02-10T10:00:00.000Z",
  profissional: {
    id: "pro-1",
    descricao: "Instalações elétricas prediais e residenciais",
    experiencia: 12,
    ativo: true,
    fotoPerfil: null,
    fotoCapa: null,
    obrasExecutadas: 15,
    disponibilidade: "INTEGRAL",
    whatsapp: "(11) 91234-5678",
    endereco: {
      cidade: "São Paulo",
      estado: "SP",
      bairro: null,
      cep: null,
      logradouro: null,
      numero: null,
      complemento: null,
    },
    servicos: [
      {
        id: "srv-1",
        titulo: "Elétrica",
        categoria: { id: "cat-1", nome: "Eletricista" },
      },
    ],
    _count: {
      solicitacoes: 15,
      avaliacoesServico: 9,
      propostas: 24,
    },
  },
};

describe("UI: PerfilClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("deve renderizar os dados reais do perfil de cliente", () => {
    render(<PerfilClient initialUser={mockClientUser} />);

    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("maria@teste.com")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getByText("Solicitações Publicadas")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    const inputNome = screen.getByLabelText(/Nome Completo/i) as HTMLInputElement;
    expect(inputNome.value).toBe("Maria Santos");
  });

  it("deve renderizar os dados e campos específicos de profissional", () => {
    render(<PerfilClient initialUser={mockProUser} />);

    expect(screen.getByText("Carlos Eletricista")).toBeInTheDocument();
    expect(screen.getByText("Profissional Verificado")).toBeInTheDocument();
    expect(screen.getByText("Serviços Executados")).toBeInTheDocument();
    expect(screen.getByText("Propostas Enviadas")).toBeInTheDocument();
    expect(screen.getByText("Eletricista")).toBeInTheDocument();

    const inputDescricao = screen.getByLabelText(/Biografia/i) as HTMLTextAreaElement;
    expect(inputDescricao.value).toBe("Instalações elétricas prediais e residenciais");

    const inputExp = screen.getByLabelText(/Experiência/i) as HTMLInputElement;
    expect(inputExp.value).toBe("12");
  });

  it("deve submeter a atualização com sucesso e exibir aviso", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { message: "Perfil atualizado com sucesso" },
      }),
    } as Response);

    render(<PerfilClient initialUser={mockClientUser} />);

    const inputNome = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(inputNome, { target: { value: "Maria Silva Santos" } });

    const submitBtn = screen.getByRole("button", { name: /Salvar Alterações/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Perfil atualizado com sucesso!")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/perfil",
      expect.objectContaining({
        method: "PATCH",
      })
    );
  });

  it("deve exibir alerta de erro quando a API retornar falha", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: { message: "Telefone com formato inválido" },
      }),
    } as Response);

    render(<PerfilClient initialUser={mockClientUser} />);

    const submitBtn = screen.getByRole("button", { name: /Salvar Alterações/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Telefone com formato inválido")).toBeInTheDocument();
    });
  });
});
