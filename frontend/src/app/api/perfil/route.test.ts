import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    withRequest: vi.fn(() => ({
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    })),
  },
}));

vi.mock("@/lib/prisma", () => {
  const mockP = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    profissional: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    endereco: {
      upsert: vi.fn(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => cb(mockP)),
  };
  return { prisma: mockP };
});

describe("API: /api/perfil", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/perfil", () => {
    it("deve retornar 401 se não houver sessão autenticada", async () => {
      vi.mocked(getAuthSession).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/perfil");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error.message).toBe("Não autenticado");
    });

    it("deve retornar 404 se o usuário não for encontrado no banco", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-123",
        role: "CLIENT",
        email: "teste@teste.com",
        name: "User",
        clienteId: "client-123",
        profissionalId: null,
      });
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/perfil");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.message).toBe("Usuário não encontrado");
    });

    it("deve retornar 200 com os dados do perfil do cliente", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-client-1",
        role: "CLIENT",
        email: "cliente@teste.com",
        name: "Cliente Teste",
        clienteId: "client-id-1",
        profissionalId: null,
      });
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-client-1",
        name: "Cliente Teste",
        email: "cliente@teste.com",
        phone: "(11) 98765-4321",
        role: "CLIENT",
        createdAt: new Date(),
        updatedAt: new Date(),
        cliente: {
          id: "client-id-1",
          _count: { solicitacoes: 2, avaliacoesServico: 1, favoritos: 3 },
        },
        profissional: null,
      } as never);

      const req = new NextRequest("http://localhost:3000/api/perfil");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Cliente Teste");
      expect(json.data.cliente._count.solicitacoes).toBe(2);
    });

    it("deve retornar 200 com os dados do perfil de profissional", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-pro-1",
        role: "PROFESSIONAL",
        email: "pro@teste.com",
        name: "Profissional Teste",
        clienteId: null,
        profissionalId: "pro-id-1",
      });
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-pro-1",
        name: "Profissional Teste",
        email: "pro@teste.com",
        phone: "(11) 91234-5678",
        role: "PROFESSIONAL",
        createdAt: new Date(),
        updatedAt: new Date(),
        cliente: null,
        profissional: {
          id: "pro-id-1",
          descricao: "Eletricista predial",
          experiencia: 8,
          ativo: true,
          fotoPerfil: null,
          fotoCapa: null,
          obrasExecutadas: 0,
          disponibilidade: null,
          whatsapp: "(11) 91234-5678",
          endereco: { cidade: "São Paulo", estado: "SP", bairro: null, cep: null, logradouro: null, numero: null, complemento: null },
          servicos: [{ id: "srv-1", titulo: "Instalação Elétrica", categoria: { id: "cat-1", nome: "Elétrica" } }],
          _count: { solicitacoes: 5, propostas: 12, avaliacoesServico: 4 },
        },
      } as never);

      const req = new NextRequest("http://localhost:3000/api/perfil");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.profissional.descricao).toBe("Eletricista predial");
      expect(json.data.profissional.endereco.cidade).toBe("São Paulo");
    });
  });

  describe("PATCH /api/perfil", () => {
    it("deve retornar 401 se não houver sessão", async () => {
      vi.mocked(getAuthSession).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({ name: "Novo Nome" }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(401);
    });

    it("deve rejeitar nome menor que 2 caracteres", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-1",
        role: "CLIENT",
        email: "teste@teste.com",
        name: "User",
        clienteId: "c-1",
        profissionalId: null,
      });
      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({ name: "A" }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.message).toContain("no mínimo 2 caracteres");
    });

    it("deve rejeitar telefone com formato inválido", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-1",
        role: "CLIENT",
        email: "teste@teste.com",
        name: "User",
        clienteId: "c-1",
        profissionalId: null,
      });
      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({ phone: "123" }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.message).toContain("Telefone com formato inválido");
    });

    it("deve atualizar perfil de CLIENT com sucesso", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-client-1",
        role: "CLIENT",
        email: "client@teste.com",
        name: "Antigo",
        clienteId: "c-1",
        profissionalId: null,
      });
      vi.mocked(prisma.user.update).mockResolvedValue({
        id: "user-client-1",
        name: "Novo Nome Cliente",
        email: "client@teste.com",
        phone: "(11) 98765-4321",
        role: "CLIENT",
      } as never);

      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({ name: "Novo Nome Cliente", phone: "(11) 98765-4321" }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.user.name).toBe("Novo Nome Cliente");
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-client-1" },
          data: { name: "Novo Nome Cliente", phone: "(11) 98765-4321" },
        })
      );
    });

    it("deve rejeitar experiência com valor negativo para profissional", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-pro-1",
        role: "PROFESSIONAL",
        email: "pro@teste.com",
        name: "Pro",
        clienteId: null,
        profissionalId: "p-1",
      });
      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({ experiencia: -5 }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.message).toContain("Anos de experiência deve estar entre 0 e 60");
    });

    it("deve atualizar perfil de PROFESSIONAL com biografia e localização via transação", async () => {
      vi.mocked(getAuthSession).mockResolvedValue({
        userId: "user-pro-1",
        role: "PROFESSIONAL",
        email: "pro@teste.com",
        name: "Pro",
        clienteId: null,
        profissionalId: "pro-rec-1",
      });
      vi.mocked(prisma.user.update).mockResolvedValue({
        id: "user-pro-1",
        name: "Profissional Atualizado",
        email: "pro@teste.com",
        phone: "(11) 91234-5678",
        role: "PROFESSIONAL",
      } as never);
      vi.mocked(prisma.profissional.findUnique).mockResolvedValue({ id: "pro-rec-1", userId: "user-pro-1" } as never);
      vi.mocked(prisma.profissional.update).mockResolvedValue({
        id: "pro-rec-1",
        descricao: "Especialista em reformas residenciais",
        experiencia: 10,
        whatsapp: "(11) 91234-5678",
      } as never);

      const req = new NextRequest("http://localhost:3000/api/perfil", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Profissional Atualizado",
          phone: "(11) 91234-5678",
          descricao: "Especialista em reformas residenciais",
          experiencia: 10,
          whatsapp: "(11) 91234-5678",
          cidade: "Campinas",
          estado: "SP",
        }),
      });

      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.endereco.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { profissionalId: "pro-rec-1" },
          update: { cidade: "Campinas", estado: "SP" },
        })
      );
    });
  });
});
