import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MensagensClient } from "./MensagensClient";
import type { ConversaItem } from "@/types/chat";

// Mock do ChatContainer para isolar o teste do MensagensClient
vi.mock("@/components/chat", () => ({
  ChatContainer: ({
    title,
    subtitle,
    status,
    onMessageSent,
  }: {
    title: string;
    subtitle: string;
    status: string;
    onMessageSent?: (msg: {
      id: string;
      solicitacaoId: string;
      usuarioId: string;
      mensagem: string;
      createdAt: string;
      autor: { id: string; nome: string; role: "CLIENT" | "PROFESSIONAL" | "ADMIN" };
    }) => void;
  }) => (
    <div data-testid="chat-container">
      <div data-testid="chat-title">{title}</div>
      <div data-testid="chat-subtitle">{subtitle}</div>
      <div data-testid="chat-status">{status}</div>
      <button
        data-testid="mock-send-btn"
        onClick={() =>
          onMessageSent?.({
            id: "msg-999",
            solicitacaoId: "sol-1",
            usuarioId: "user-1",
            mensagem: "Nova mensagem enviada pelo teste",
            createdAt: "2026-10-15T16:00:00Z",
            autor: { id: "user-1", nome: "Cliente Teste", role: "CLIENT" },
          })
        }
      >
        Simular Envio
      </button>
    </div>
  ),
}));

describe("UI: MensagensClient", () => {
  const conversasMock: ConversaItem[] = [
    {
      id: "sol-1",
      titulo: "Reforma Elétrica da Cozinha",
      status: "EM_EXECUCAO",
      createdAt: "2026-10-10T10:00:00Z",
      updatedAt: "2026-10-15T14:30:00Z",
      interlocutor: {
        id: "pro-1",
        nome: "Roberto Eletricista",
        role: "PROFESSIONAL",
        email: "roberto@obra.com",
      },
      ultimaMensagem: {
        id: "msg-1",
        mensagem: "Os materiais chegam amanhã.",
        createdAt: "2026-10-15T14:30:00Z",
      },
      totalMensagens: 5,
    },
    {
      id: "sol-2",
      titulo: "Pintura Geral Apartamento",
      status: "ACEITA",
      createdAt: "2026-10-12T08:00:00Z",
      updatedAt: "2026-10-14T09:15:00Z",
      interlocutor: {
        id: "pro-2",
        nome: "Mariana Pintora",
        role: "PROFESSIONAL",
        email: "mariana@obra.com",
      },
      ultimaMensagem: null,
      totalMensagens: 0,
    },
  ];

  it("deve renderizar a lista de conversas com dados reais do interlocutor e solicitação", () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    const aside = screen.getByRole("complementary");

    // Valida dados da primeira conversa na barra lateral
    expect(within(aside).getByText("Roberto Eletricista")).toBeInTheDocument();
    expect(within(aside).getByText("Reforma Elétrica da Cozinha")).toBeInTheDocument();
    expect(within(aside).getByText("Os materiais chegam amanhã.")).toBeInTheDocument();
    expect(within(aside).getByText("Em andamento")).toBeInTheDocument();

    // Valida dados da segunda conversa na barra lateral
    expect(within(aside).getByText("Mariana Pintora")).toBeInTheDocument();
    expect(within(aside).getByText("Pintura Geral Apartamento")).toBeInTheDocument();
    expect(within(aside).getByText("Nenhuma mensagem ainda. Inicie a conversa!")).toBeInTheDocument();
    expect(within(aside).getByText("Aceita")).toBeInTheDocument();
  });

  it("deve selecionar a primeira conversa por padrão e renderizar o ChatContainer", () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    const container = screen.getByTestId("chat-container");
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId("chat-title")).toHaveTextContent("Roberto Eletricista");
    expect(screen.getByTestId("chat-subtitle")).toHaveTextContent("Reforma Elétrica da Cozinha • Profissional");
  });

  it("deve alternar a conversa ativa ao clicar em outro item da lista", async () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    const aside = screen.getByRole("complementary");

    // Clica na segunda conversa dentro da lista
    await userEvent.click(within(aside).getByText("Mariana Pintora"));

    expect(screen.getByTestId("chat-title")).toHaveTextContent("Mariana Pintora");
    expect(screen.getByTestId("chat-subtitle")).toHaveTextContent("Pintura Geral Apartamento • Profissional");
  });

  it("deve filtrar as conversas corretamente pelo campo de busca", async () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    const aside = screen.getByRole("complementary");
    const inputBusca = screen.getByPlaceholderText("Pesquisar conversas...");
    await userEvent.type(inputBusca, "Mariana");

    expect(within(aside).getByText("Mariana Pintora")).toBeInTheDocument();
    expect(within(aside).queryByText("Roberto Eletricista")).not.toBeInTheDocument();
  });

  it("deve exibir o estado vazio quando o usuário não tiver conversas ativas", () => {
    render(
      <MensagensClient
        conversas={[]}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    expect(screen.getByText("Nenhuma conversa ativa no momento")).toBeInTheDocument();
    expect(
      screen.getByText(/Assim que sua solicitação tiver um profissional vinculado/i)
    ).toBeInTheDocument();
  });

  it("deve exibir o texto correto de estado vazio para o perfil profissional", () => {
    render(
      <MensagensClient
        conversas={[]}
        usuarioAtual={{ id: "pro-1", name: "Profissional Teste", role: "PROFESSIONAL" }}
      />
    );

    expect(screen.getByText("Nenhuma conversa ativa no momento")).toBeInTheDocument();
    expect(
      screen.getByText(/Você poderá conversar com clientes assim que aceitar solicitações/i)
    ).toBeInTheDocument();
  });

  it("NÃO deve conter dados estáticos ('Registro de Atividade #1001' ou 'Novo Registro')", () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    expect(screen.queryByText(/Registro de Atividade/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Novo Registro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Carregar mais resultados/i)).not.toBeInTheDocument();
  });

  it("deve atualizar a prévia da última mensagem na lista lateral quando uma nova mensagem for enviada", async () => {
    render(
      <MensagensClient
        conversas={conversasMock}
        usuarioAtual={{ id: "user-1", name: "Cliente Teste", role: "CLIENT" }}
      />
    );

    const aside = screen.getByRole("complementary");
    expect(within(aside).getByText("Os materiais chegam amanhã.")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("mock-send-btn"));

    expect(within(aside).getByText("Nova mensagem enviada pelo teste")).toBeInTheDocument();
  });
});
