import { describe, it, expect, vi, afterEach } from "vitest";
import { audit, AuditPayload } from "./audit";
import { NextRequest } from "next/server";
import { logger } from "./logger";

describe("Audit Logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve registrar auditoria CRITICAL em info() quando a operação for um sucesso", () => {
    // Arrange
    const mockRequest = new NextRequest("http://localhost");
    mockRequest.headers.set("x-forwarded-for", "192.168.0.1");
    mockRequest.headers.set("user-agent", "Mozilla/5.0");
    const reqLogger = logger.withRequest(mockRequest);
    const infoSpy = vi.spyOn(reqLogger, "info").mockImplementation(() => {});

    const payload: AuditPayload = {
      action: "AUTH_LOGIN",
      severity: "CRITICAL",
      result: "SUCCESS",
      userId: "user-1",
      metadata: { sessionLength: 3600 },
    };

    // Act
    audit.log(reqLogger, mockRequest, payload);

    // Assert
    expect(infoSpy).toHaveBeenCalledOnce();
    const [msg, context] = infoSpy.mock.calls[0];
    expect(msg).toContain("Audit: AUTH_LOGIN [SUCCESS]");
    expect(context).toMatchObject({
      audit: {
        action: "AUTH_LOGIN",
        severity: "CRITICAL",
        result: "SUCCESS",
        userId: "user-1",
        ip: "192.168.0.1",
        userAgent: "Mozilla/5.0",
        metadata: { sessionLength: 3600 },
      },
    });
  });

  it("deve registrar auditoria CRITICAL em warn() quando a operação for uma falha", () => {
    // Arrange
    const mockRequest = new NextRequest("http://localhost");
    const reqLogger = logger.withRequest(mockRequest);
    const warnSpy = vi.spyOn(reqLogger, "warn").mockImplementation(() => {});

    const payload: AuditPayload = {
      action: "PROPOSTA_CREATED",
      severity: "CRITICAL",
      result: "FAILURE",
    };

    // Act
    audit.log(reqLogger, mockRequest, payload);

    // Assert
    expect(warnSpy).toHaveBeenCalledOnce();
    const [msg, context] = warnSpy.mock.calls[0];
    expect(msg).toContain("Audit: PROPOSTA_CREATED [FAILURE]");
    // Validando fallback paramétrico para Headers ausentes no objeto dinâmico
    expect(context).toMatchObject({
      audit: {
        ip: "unknown",
        userAgent: "unknown",
      },
    });
  });

  it("não deve acionar logs para severidades menores que CRITICAL (short-circuit)", () => {
    // Arrange
    const reqLogger = logger.withRequest(new NextRequest("http://localhost"));
    const infoSpy = vi.spyOn(reqLogger, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(reqLogger, "warn").mockImplementation(() => {});

    const payload: AuditPayload = {
      action: "AUTH_LOGOUT",
      severity: "INFO",
      result: "SUCCESS",
    };

    // Act
    audit.log(reqLogger, new NextRequest("http://localhost"), payload);

    // Assert
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
