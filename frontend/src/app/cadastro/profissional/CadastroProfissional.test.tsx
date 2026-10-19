import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CadastroProfissionalClient } from "./CadastroProfissionalClient";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}));

describe("UI: CadastroProfissionalClient", () => {
  const categoriasMock = [
    { id: "cat-1", nome: "Eletricista" },
    { id: "cat-2", nome: "Encanador" },
    { id: "cat-3", nome: "Pedreiro" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("1. deve renderizar todos os campos necessários do formulário de profissional", () => {
    render(<CadastroProfissionalClient categorias={categoriasMock} />);

    expect(screen.getByText("Cadastro de Profissional")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail Comercial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone \/ WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Especialidade Principal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade de Atuação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/UF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apresentação Profissional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar como Profissional/i })).toBeInTheDocument();
  });

  it("2. deve listar as categorias de serviço nas opções do select", () => {
    render(<CadastroProfissionalClient categorias={categoriasMock} />);

    expect(screen.getByRole("option", { name: "Eletricista" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Encanador" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pedreiro" })).toBeInTheDocument();
  });

  it("3. deve exibir erros de validação caso campos obrigatórios estejam vazios ao submeter", async () => {
    const user = userEvent.setup();
    render(<CadastroProfissionalClient categorias={categoriasMock} />);

    const submitBtn = screen.getByRole("button", { name: /Cadastrar como Profissional/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(screen.getByText("Telefone incompleto")).toBeInTheDocument();
      expect(screen.getByText("Selecione sua especialidade principal")).toBeInTheDocument();
      expect(screen.getByText("Informe a cidade onde você atende")).toBeInTheDocument();
      expect(screen.getByText("UF deve ter 2 letras")).toBeInTheDocument();
      expect(screen.getByText("Você deve aceitar os termos")).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("4. deve submeter o cadastro com sucesso e redirecionar para /profissional/pedidos", async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          userId: "usr-123",
          profissionalId: "pro-456",
          name: "Marcio Eletricista",
          email: "marcio@eletrica.com",
          role: "PROFESSIONAL",
        },
      }),
    } as Response);

    render(<CadastroProfissionalClient categorias={categoriasMock} />);

    await user.type(screen.getByLabelText(/Nome Completo/i), "Marcio Eletricista");
    await user.type(screen.getByLabelText(/E-mail Comercial/i), "marcio@eletrica.com");
    await user.type(screen.getByLabelText(/Telefone \/ WhatsApp/i), "(11) 98765-4321");
    await user.selectOptions(screen.getByLabelText(/Especialidade Principal/i), "cat-1");
    await user.type(screen.getByLabelText(/Cidade de Atuação/i), "Campinas");
    await user.type(screen.getByLabelText(/UF/i), "SP");
    await user.type(
      screen.getByLabelText(/Apresentação Profissional/i),
      "Instalações elétricas residenciais e industriais com certificação técnica."
    );
    await user.type(screen.getByLabelText(/^Senha \*/i), "SenhaSegura123!");
    await user.type(screen.getByLabelText(/Confirmar Senha/i), "SenhaSegura123!");
    await user.click(screen.getByRole("checkbox"));

    const submitBtn = screen.getByRole("button", { name: /Cadastrar como Profissional/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/register-profissional",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/profissional/pedidos");
    });
  });

  it("5. deve exibir alerta de erro quando a API retornar falha (ex: e-mail duplicado)", async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: "Email já cadastrado",
      }),
    } as Response);

    render(<CadastroProfissionalClient categorias={categoriasMock} />);

    await user.type(screen.getByLabelText(/Nome Completo/i), "Marcio Eletricista");
    await user.type(screen.getByLabelText(/E-mail Comercial/i), "marcio@eletrica.com");
    await user.type(screen.getByLabelText(/Telefone \/ WhatsApp/i), "(11) 98765-4321");
    await user.selectOptions(screen.getByLabelText(/Especialidade Principal/i), "cat-1");
    await user.type(screen.getByLabelText(/Cidade de Atuação/i), "Campinas");
    await user.type(screen.getByLabelText(/UF/i), "SP");
    await user.type(
      screen.getByLabelText(/Apresentação Profissional/i),
      "Instalações elétricas residenciais e industriais com certificação técnica."
    );
    await user.type(screen.getByLabelText(/^Senha \*/i), "SenhaSegura123!");
    await user.type(screen.getByLabelText(/Confirmar Senha/i), "SenhaSegura123!");
    await user.click(screen.getByRole("checkbox"));

    const submitBtn = screen.getByRole("button", { name: /Cadastrar como Profissional/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Email já cadastrado")).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
