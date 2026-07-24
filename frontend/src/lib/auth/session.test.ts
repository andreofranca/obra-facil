import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createSessionCookieValue,
  parseSessionCookieValue,
  getSessionCookieName,
} from "./session";
import type { AuthSession } from "@/types/auth";
import { Buffer } from "node:buffer";

describe("Session Auth Helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Isolar as variáveis de ambiente
    process.env = { ...originalEnv, AUTH_SESSION_SECRET: "test-secret-key" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getSessionCookieName", () => {
    it("deve retornar o nome correto do cookie de sessão", () => {
      // Arrange & Act
      const name = getSessionCookieName();

      // Assert
      expect(name).toBe("obra_facil_session");
    });
  });

  describe("createSessionCookieValue", () => {
    it("deve criar um valor de cookie formatado corretamente com payload e assinatura", () => {
      // Arrange
      const session = { userId: "user123", role: "CLIENT" } as AuthSession;

      // Act
      const cookieValue = createSessionCookieValue(session);

      // Assert
      expect(typeof cookieValue).toBe("string");
      expect(cookieValue.includes(".")).toBe(true);

      const parts = cookieValue.split(".");
      expect(parts.length).toBe(2);

      // O payload deve ser o JSON decodificável
      const payloadBase64 = parts[0];
      const decodedPayload = Buffer.from(payloadBase64, "base64url").toString("utf8");
      expect(JSON.parse(decodedPayload)).toEqual(session);
    });
  });

  describe("parseSessionCookieValue", () => {
    it("deve decodificar e retornar a sessão válida quando a assinatura bater", () => {
      // Arrange
      const session = { userId: "user-ok", role: "PROFESSIONAL" } as AuthSession;
      const validCookie = createSessionCookieValue(session);

      // Act
      const parsedSession = parseSessionCookieValue(validCookie);

      // Assert
      expect(parsedSession).not.toBeNull();
      expect(parsedSession?.userId).toBe("user-ok");
      expect(parsedSession?.role).toBe("PROFESSIONAL");
    });

    it("deve retornar null se a string do cookie for nula ou vazia", () => {
      // Arrange
      const emptyCookie = undefined;

      // Act
      const parsedSession = parseSessionCookieValue(emptyCookie);

      // Assert
      expect(parsedSession).toBeNull();
    });

    it("deve retornar null se o formato do cookie for inválido", () => {
      // Arrange
      const invalidCookie = "apenas-payload-sem-assinatura";

      // Act
      const parsedSession = parseSessionCookieValue(invalidCookie);

      // Assert
      expect(parsedSession).toBeNull();
    });

    it("deve retornar null se a assinatura não corresponder ao payload (Adulteração de payload)", () => {
      // Arrange
      const session = { userId: "user-ok", role: "CLIENT" } as AuthSession;
      const validCookie = createSessionCookieValue(session);
      
      const parts = validCookie.split(".");
      const hackerPayloadBase64 = Buffer.from(
        JSON.stringify({ userId: "admin-hacker", role: "ADMIN" }),
        "utf8"
      ).toString("base64url");
      
      const tamperedCookie = `${hackerPayloadBase64}.${parts[1]}`;

      // Act
      const parsedSession = parseSessionCookieValue(tamperedCookie);

      // Assert
      expect(parsedSession).toBeNull();
    });

    it("deve retornar null se o segredo do ambiente mudar invalidando os cookies anteriores", () => {
      // Arrange
      const session = { userId: "user-old", role: "CLIENT" } as AuthSession;
      const validCookie = createSessionCookieValue(session);

      // Mudando o segredo no Act para simular rotação de chaves
      process.env.AUTH_SESSION_SECRET = "new-secret-key-rotated";

      // Act
      const parsedSession = parseSessionCookieValue(validCookie);

      // Assert
      expect(parsedSession).toBeNull();
    });
  });
});
