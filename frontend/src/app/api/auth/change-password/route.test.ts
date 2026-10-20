import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  getAuthSession: vi.fn(),
  verifyPassword: vi.fn(async (plain: string, stored: string) => {
    return stored === `hashed:${plain}`;
  }),
  hashPassword: vi.fn(async (plain: string) => `hashed:${plain}`),
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

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("API: /api/auth/change-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 401 se o usuário não estiver autenticado", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error.message).toBe("Não autenticado");
  });

  it("deve retornar 400 se algum campo estiver vazio", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toContain("Todos os campos de senha são obrigatórios");
  });

  it("deve retornar 400 se a nova senha e a confirmação divergirem", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
        confirmPassword: "DifferentPassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toContain("não coincidem");
  });

  it("deve retornar 400 se a nova senha não atender aos requisitos de complexidade", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "OldPassword123!",
        newPassword: "simples",
        confirmPassword: "simples",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toContain("requisitos de segurança");
  });

  it("deve retornar 400 se a nova senha for igual à senha atual", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "SamePassword123!",
        newPassword: "SamePassword123!",
        confirmPassword: "SamePassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toContain("deve ser diferente da senha atual");
  });

  it("deve retornar 400 se a senha atual estiver incorreta", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      password: "hashed:CorrectOldPassword123!",
    } as unknown as { id: string; password: string });

    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "WrongPassword123!",
        newPassword: "NewValidPassword123!",
        confirmPassword: "NewValidPassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.message).toContain("A senha atual informada está incorreta");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("deve alterar a senha com sucesso quando os dados forem válidos", async () => {
    vi.mocked(getAuthSession).mockResolvedValue({
      userId: "user-1",
      role: "CLIENT",
      email: "teste@teste.com",
      name: "User",
      clienteId: "c-1",
      profissionalId: null,
    });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      password: "hashed:CorrectOldPassword123!",
    } as unknown as { id: string; password: string });
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "user-1" } as unknown as { id: string });

    const req = new NextRequest("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "CorrectOldPassword123!",
        newPassword: "BrandNewPassword123!",
        confirmPassword: "BrandNewPassword123!",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.message).toBe("Senha alterada com sucesso");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { password: "hashed:BrandNewPassword123!" },
    });
  });
});
