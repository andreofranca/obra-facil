import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// Mock das dependências externas
vi.mock("@/lib/auth", () => ({
  hashPassword: vi.fn(async (pwd: string) => `hashed:${pwd}`),
  createSessionCookieValue: vi.fn(() => "mock-session-cookie-token"),
  getSessionCookieName: vi.fn(() => "obra_facil_session"),
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

vi.mock("@/lib/audit", () => ({
  audit: {
    log: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    categoriaServico: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => {
      // Executa o callback passando o mock de transação
      return callback({
        user: {
          create: vi.fn(async (args: {
            data: {
              name: string;
              email: string;
              phone: string;
              password: string;
              role: string;
              profissional: {
                create: {
                  descricao: string;
                  experiencia?: number;
                  ativo: boolean;
                  whatsapp: string;
                  disponibilidade: string;
                  obrasExecutadas: number;
                  endereco?: {
                    create: {
                      cidade?: string;
                      estado?: string;
                    };
                  };
                  servicos: {
                    create: Array<{
                      titulo: string;
                      descricao: string;
                      categoriaId: string;
                    }>;
                  };
                };
              };
            };
          }) => ({
            id: "user-pro-123",
            name: args.data.name,
            email: args.data.email,
            role: args.data.role,
            profissional: {
              id: "pro-456",
            },
          })),
        },
      });
    }),
  },
}));

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

describe("API: /api/auth/register-profissional (POST)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    name: "Carlos Pedreiro",
    email: "carlos@construcao.com",
    phone: "(11) 98765-4321",
    password: "SenhaForte123!",
    categoriaId: "cat-pedreiro",
    descricao: "Mestre de obras com mais de 15 anos de experiência em reformas e fundações.",
    cidade: "São Paulo",
    estado: "SP",
    experiencia: 15,
  };

  it("1. deve cadastrar um profissional com sucesso, persistir dados e retornar sessão", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.categoriaServico.findUnique).mockResolvedValue({
      id: "cat-pedreiro",
      nome: "Pedreiro",
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user).toBeDefined();
    expect(body.user.userId).toBe("user-pro-123");
    expect(body.user.profissionalId).toBe("pro-456");
    expect(body.user.role).toBe("PROFESSIONAL");
    expect(body.user.name).toBe("Carlos Pedreiro");
    expect(body.user.email).toBe("carlos@construcao.com");

    // Verifica que cookie de sessão foi anexado
    const cookieHeader = response.headers.get("set-cookie");
    expect(cookieHeader).toContain("obra_facil_session");
  });

  it("2. deve ignorar qualquer papel enviado pelo cliente e impor role: 'PROFESSIONAL' no servidor", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.categoriaServico.findUnique).mockResolvedValue({
      id: "cat-pedreiro",
      nome: "Pedreiro",
    });

    // Tentativa maliciosa de se registrar como ADMIN ou CLIENT
    const maliciousPayload = {
      ...validPayload,
      role: "ADMIN",
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(maliciousPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user.role).toBe("PROFESSIONAL"); // Estritamente forçado pelo servidor
  });

  it("3. deve rejeitar e-mail duplicado com status HTTP 409", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user-id",
    } as unknown as { id: string });

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("Email já cadastrado");
  });

  it("4. deve rejeitar se a especialidade selecionada não existir no banco", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.categoriaServico.findUnique).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Especialidade selecionada não encontrada");
  });

  it("5. deve rejeitar senhas fracas que não cumpram a política de complexidade", async () => {
    const weakPayload = {
      ...validPayload,
      password: "123", // Fraca
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(weakPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("A senha deve ter entre 8 e 100 caracteres");
  });

  it("6. deve rejeitar payload com campos obrigatórios ausentes ou em branco", async () => {
    const incompletePayload = {
      name: "",
      email: "invalido",
      password: "SenhaForte123!",
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(incompletePayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Informe nome, email, senha");
  });

  it("7. deve criptografar a senha usando hash seguro e nunca retornar dados sensíveis", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.categoriaServico.findUnique).mockResolvedValue({
      id: "cat-pedreiro",
      nome: "Pedreiro",
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(hashPassword).toHaveBeenCalledWith("SenhaForte123!");
    expect(body.user.password).toBeUndefined();
    expect(body.password).toBeUndefined();
    expect(body.passwordHash).toBeUndefined();
  });

  it("8. deve retornar 500 se o banco de dados falhar durante a transação", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.categoriaServico.findUnique).mockResolvedValue({
      id: "cat-pedreiro",
      nome: "Pedreiro",
    });
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error("Falha de conexão com Postgres"));

    const request = new NextRequest("http://localhost:3000/api/auth/register-profissional", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Erro interno ao cadastrar profissional");
  });
});
