import { describe, it, expect } from "vitest";
import { apiSuccess, apiError } from "./responses";

describe("Formatadores de Resposta da API", () => {
  describe("apiSuccess", () => {
    it("deve formatar corretamente o payload de sucesso com status 200 padrão", async () => {
      // Arrange
      const mockData = { id: 1, name: "Obra Fácil" };

      // Act
      const response = apiSuccess(mockData);
      
      // NextResponse internal body is a ReadableStream, but we can extract json
      const json = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: { id: 1, name: "Obra Fácil" },
      });
    });

    it("deve respeitar o status code customizado passado por parâmetro", () => {
      // Arrange
      const mockData = { created: true };

      // Act
      const response = apiSuccess(mockData, 201);

      // Assert
      expect(response.status).toBe(201);
    });
  });

  describe("apiError", () => {
    it("deve formatar corretamente o payload de erro", async () => {
      // Arrange
      const errorMessage = "Acesso Negado";
      const statusCode = 403;

      // Act
      const response = apiError(errorMessage, statusCode);
      const json = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(json).toEqual({
        success: false,
        error: { message: "Acesso Negado" },
      });
    });
  });
});
