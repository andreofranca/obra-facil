import { describe, it, expect } from "vitest";
import type { AuthSession } from "@/types/auth";
import {
  hasRole,
  requireAuth,
  requireRole,
  hasSolicitationOwnership,
  requireSolicitationOwnership,
} from "./guards";

describe("Guards de Autenticação e Autorização", () => {
  describe("requireAuth", () => {
    it("deve retornar null quando houver uma sessão autenticada válida", () => {
      // Arrange
      const session = { userId: "1", role: "CLIENT" } as AuthSession;

      // Act
      const result = requireAuth(session);

      // Assert
      expect(result).toBeNull();
    });

    it("deve retornar um NextResponse com status 401 quando não houver sessão", () => {
      // Arrange
      const session = null;

      // Act
      const response = requireAuth(session);

      // Assert
      expect(response).not.toBeNull();
      expect(response?.status).toBe(401);
    });
  });

  describe("hasRole", () => {
    it("deve retornar true quando a sessão tiver a role correspondente", () => {
      // Arrange
      const session = { role: "CLIENT" } as AuthSession;

      // Act
      const result = hasRole(session, "CLIENT");

      // Assert
      expect(result).toBe(true);
    });

    it("deve retornar false quando a sessão não tiver a role correspondente", () => {
      // Arrange
      const session = { role: "CLIENT" } as AuthSession;

      // Act
      const result = hasRole(session, "PROFESSIONAL");

      // Assert
      expect(result).toBe(false);
    });

    it("deve retornar false quando a sessão for nula", () => {
      // Arrange
      const session = null;

      // Act
      const result = hasRole(session, "CLIENT");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("requireRole", () => {
    it("deve permitir o acesso retornando null quando a role for válida", () => {
      // Arrange
      const session = { role: "PROFESSIONAL" } as AuthSession;

      // Act
      const result = requireRole(session, "PROFESSIONAL");

      // Assert
      expect(result).toBeNull();
    });

    it("deve bloquear o acesso retornando status 403 quando a role for inválida", () => {
      // Arrange
      const session = { role: "CLIENT" } as AuthSession;

      // Act
      const response = requireRole(session, "PROFESSIONAL");

      // Assert
      expect(response).not.toBeNull();
      expect(response?.status).toBe(403);
    });
  });

  describe("hasSolicitationOwnership", () => {
    it("deve retornar true quando for o cliente proprietário da solicitação", () => {
      // Arrange
      const session = { role: "CLIENT", clienteId: "cli-1" } as AuthSession;
      const solicitation = { clienteId: "cli-1", profissionalId: null };

      // Act
      const result = hasSolicitationOwnership(session, solicitation);

      // Assert
      expect(result).toBe(true);
    });

    it("deve retornar true quando for o profissional vinculado à solicitação", () => {
      // Arrange
      const session = { role: "PROFESSIONAL", profissionalId: "pro-1" } as AuthSession;
      const solicitation = { clienteId: "cli-1", profissionalId: "pro-1" };

      // Act
      const result = hasSolicitationOwnership(session, solicitation);

      // Assert
      expect(result).toBe(true);
    });

    it("deve retornar false quando for um cliente de outra solicitação", () => {
      // Arrange
      const session = { role: "CLIENT", clienteId: "cli-2" } as AuthSession;
      const solicitation = { clienteId: "cli-1", profissionalId: null };

      // Act
      const result = hasSolicitationOwnership(session, solicitation);

      // Assert
      expect(result).toBe(false);
    });

    it("deve retornar false quando a sessão for nula", () => {
      // Arrange
      const session = null;
      const solicitation = { clienteId: "cli-1", profissionalId: null };

      // Act
      const result = hasSolicitationOwnership(session, solicitation);

      // Assert
      expect(result).toBe(false);
    });
  });
});
