import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import type { AuthSession } from "@/types/auth";

// Mock das dependências
vi.mock("@/lib/auth", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    solicitarServico: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    mensagemSolicitacao: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

describe("API: /api/solicitacoes/[id]/mensagens", () => {
  const solicitacaoMock = {
    id: "sol-123",
    clienteId: "cli-100",
    profissionalId: "pro-200",
  };

  const clientSession: AuthSession = {
    userId: "user-client",
    name: "Cliente Teste",
    email: "cliente@teste.com",
    role: "CLIENT",
    clienteId: "cli-100",
    profissionalId: null,
  };

  const proSession: AuthSession = {
    userId: "user-pro",
    name: "Profissional Teste",
    email: "pro@teste.com",
    role: "PROFESSIONAL",
    clienteId: null,
    profissionalId: "pro-200",
  };

  const outsiderSession: AuthSession = {
    userId: "user-invasor",
    name: "Invasor",
    email: "invasor@teste.com",
    role: "CLIENT",
    clienteId: "cli-999",
    profissionalId: null,
  };

  const contextParams = {
    params: Promise.resolve({ id: "sol-123" }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/solicitacoes/[id]/mensagens", () => {
    it("deve retornar 401 se o usuário não estiver autenticado", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens");
      const res = await GET(req, contextParams);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Usuário não autenticado");
    });

    it("deve retornar 404 se a solicitação não for encontrada", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens");
      const res = await GET(req, contextParams);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Solicitação não encontrada");
    });

    it("deve retornar 403 se o usuário não for participante da solicitação", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(outsiderSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(
        solicitacaoMock as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>
      );

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens");
      const res = await GET(req, contextParams);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe("Acesso não permitido para esta solicitação");
    });

    it("deve permitir que o cliente autorizado consulte as mensagens", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(
        solicitacaoMock as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>
      );
      vi.mocked(prisma.mensagemSolicitacao.count).mockResolvedValueOnce(1);
      vi.mocked(prisma.mensagemSolicitacao.findMany).mockResolvedValueOnce([
        {
          id: "msg-1",
          solicitacaoId: "sol-123",
          usuarioId: "user-client",
          mensagem: "Olá profissional",
          createdAt: new Date("2026-08-07T12:00:00Z"),
          autor: {
            id: "user-client",
            name: "Cliente Teste",
            role: "CLIENT",
          },
        },
      ] as unknown as Awaited<ReturnType<typeof prisma.mensagemSolicitacao.findMany>>);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens");
      const res = await GET(req, contextParams);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.solicitacaoId).toBe("sol-123");
      expect(data.mensagens).toHaveLength(1);
      expect(data.mensagens[0].mensagem).toBe("Olá profissional");
      expect(data.mensagens[0].autor.nome).toBe("Cliente Teste");
    });

    it("deve permitir que o profissional autorizado consulte as mensagens", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(proSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(
        solicitacaoMock as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>
      );
      vi.mocked(prisma.mensagemSolicitacao.count).mockResolvedValueOnce(0);
      vi.mocked(prisma.mensagemSolicitacao.findMany).mockResolvedValueOnce([]);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens");
      const res = await GET(req, contextParams);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.mensagens).toEqual([]);
    });
  });

  describe("POST /api/solicitacoes/[id]/mensagens", () => {
    it("deve retornar 401 se não estiver autenticado", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({ mensagem: "Teste" }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(401);
    });

    it("deve retornar 400 se a mensagem estiver vazia ou com espaços", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({ mensagem: "   " }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("A mensagem não pode ser vazia");
    });

    it("deve retornar 400 se a mensagem exceder 5000 caracteres", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);

      const longMessage = "a".repeat(5001);
      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({ mensagem: longMessage }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("A mensagem excede o limite permitido de 5000 caracteres");
    });

    it("deve retornar 400 se houver tentativa de falsificar a identidade do remetente", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({
          mensagem: "Tentando fingir ser outro",
          usuarioId: "user-vitima", // Falsificação!
        }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Identidade do remetente incompatível com a sessão autenticada");
    });

    it("deve retornar 403 se o usuário tentar enviar mensagem em solicitação alheia", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(outsiderSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(
        solicitacaoMock as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>
      );

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({ mensagem: "Mensagem indevida" }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(403);
    });

    it("deve retornar 400 se a solicitação estiver com status encerrado ou inativo", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce({
        ...solicitacaoMock,
        status: "CONCLUIDA",
      } as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({ mensagem: "Tentando falar em pedido fechado" }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Não é permitido enviar mensagens para uma solicitação inativa ou encerrada");
    });

    it("deve persistir a mensagem com o userId da sessão e retornar 201", async () => {
      vi.mocked(getAuthSession).mockResolvedValueOnce(clientSession);
      vi.mocked(prisma.solicitarServico.findUnique).mockResolvedValueOnce(
        solicitacaoMock as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.findUnique>>
      );

      const novaMensagemMock = {
        id: "msg-nova",
        solicitacaoId: "sol-123",
        usuarioId: "user-client",
        mensagem: "Podemos agendar a visita técnica?",
        createdAt: new Date("2026-10-15T15:00:00Z"),
        autor: {
          id: "user-client",
          name: "Cliente Teste",
          role: "CLIENT",
        },
      };

      vi.mocked(prisma.mensagemSolicitacao.create).mockResolvedValueOnce(
        novaMensagemMock as unknown as Awaited<ReturnType<typeof prisma.mensagemSolicitacao.create>>
      );
      vi.mocked(prisma.solicitarServico.update).mockResolvedValueOnce(
        {} as unknown as Awaited<ReturnType<typeof prisma.solicitarServico.update>>
      );
      vi.mocked(prisma.$transaction).mockResolvedValueOnce([novaMensagemMock, {}]);

      const req = new NextRequest("http://localhost:3000/api/solicitacoes/sol-123/mensagens", {
        method: "POST",
        body: JSON.stringify({
          mensagem: "Podemos agendar a visita técnica?",
        }),
      });
      const res = await POST(req, contextParams);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBe("msg-nova");
      expect(data.usuarioId).toBe("user-client");
      expect(data.mensagem).toBe("Podemos agendar a visita técnica?");
      expect(data.autor.nome).toBe("Cliente Teste");

      // Verifica que o create foi chamado com o ID real da sessão autenticada
      expect(prisma.mensagemSolicitacao.create).toHaveBeenCalledWith({
        data: {
          solicitacaoId: "sol-123",
          usuarioId: "user-client",
          mensagem: "Podemos agendar a visita técnica?",
        },
        include: {
          autor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      // Verifica que a solicitação teve updatedAt atualizado
      expect(prisma.solicitarServico.update).toHaveBeenCalledWith({
        where: { id: "sol-123" },
        data: { updatedAt: expect.any(Date) },
      });
    });
  });
});
