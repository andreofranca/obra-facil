import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "./logger";
import { NextRequest } from "next/server";

describe("Logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Níveis Básicos (debug, info, warn)", () => {
    it("deve estruturar corretamente e acionar o console.info", () => {
      // Arrange
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});
      const mensagem = "Operação concluída";

      // Act
      logger.info(mensagem, { usuarioId: 123 });

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        level: "info",
        message: mensagem,
        usuarioId: 123,
      });
      expect(output).toHaveProperty("timestamp");
    });
    
    it("deve estruturar corretamente e acionar o console.warn", () => {
      // Arrange
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const mensagem = "Limite próximo";

      // Act
      logger.warn(mensagem, { retries: 3 });

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        level: "warn",
        message: mensagem,
        retries: 3,
      });
    });
    
    it("deve estruturar corretamente e acionar o console.debug", () => {
      // Arrange
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

      // Act
      logger.debug("Tracing ativo");

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        level: "debug",
      });
    });
  });

  describe("Erros Fatais", () => {
    it("deve capturar stack trace ao receber uma instância de Error real", () => {
      // Arrange
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const erroReal = new Error("Falha no DB");

      // Act
      logger.error(erroReal);

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        level: "error",
        message: "Falha no DB",
      });
      expect(output).toHaveProperty("errorStack");
      expect(output.errorStack).toContain("Error: Falha no DB");
    });

    it("deve tolerar tipos primitivos sendo passados para log de erro e não quebrar", () => {
      // Arrange
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Act
      logger.error(404);

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        level: "error",
        message: "404",
      });
      expect(output).not.toHaveProperty("errorStack");
    });
  });

  describe("Contexto e NextRequest", () => {
    it("deve atrelar requestId e correlationId via withRequest", () => {
      // Arrange
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});
      const requestFake = new NextRequest("http://localhost");
      requestFake.headers.set("x-request-id", "req-123");
      requestFake.headers.set("x-correlation-id", "corr-456");

      // Act
      const reqLogger = logger.withRequest(requestFake);
      reqLogger.info("Log atrelado à request");

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output).toMatchObject({
        requestId: "req-123",
        correlationId: "corr-456",
      });
    });
    
    it("deve prover requestId aleatório nativo caso os cabeçalhos não existam", () => {
      // Arrange
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});
      const requestVazia = new NextRequest("http://localhost");

      // Act
      const reqLogger = logger.withRequest(requestVazia);
      reqLogger.info("Novo acesso");

      // Assert
      const output = JSON.parse(spy.mock.calls[0][0] as string);
      expect(output.requestId).toBeDefined();
      expect(output.correlationId).toBeDefined();
      expect(output.requestId).toBe(output.correlationId);
    });
  });
});
