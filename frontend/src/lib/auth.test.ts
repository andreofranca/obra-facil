import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

describe("Auth Crypto Module (auth.ts)", () => {
  describe("hashPassword", () => {
    it("deve encriptar a senha retornando salt e hash delimitados por dois-pontos", async () => {
      // Arrange
      const senhaPlana = "SenhaForte123!";

      // Act
      const hashGerado = await hashPassword(senhaPlana);

      // Assert
      expect(hashGerado).toContain(":");
      const partes = hashGerado.split(":");
      expect(partes.length).toBe(2);
      expect(partes[0].length).toBeGreaterThan(0); // Salt
      expect(partes[1].length).toBeGreaterThan(0); // Hash
    });
    
    it("deve gerar hashes únicos e diferentes para a mesma string plana (Salting randômico operante)", async () => {
      // Arrange
      const senhaPura = "SenhaUnica123";

      // Act
      const hash1 = await hashPassword(senhaPura);
      const hash2 = await hashPassword(senhaPura);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("deve retornar true quando testada com a senha original formadora do hash", async () => {
      // Arrange
      const senhaClara = "SenhaOriginal999";
      const hashGuardado = await hashPassword(senhaClara);

      // Act
      const valido = await verifyPassword(senhaClara, hashGuardado);

      // Assert
      expect(valido).toBe(true);
    });

    it("deve retornar false quando for fornecida senha incorreta contra hash verídico", async () => {
      // Arrange
      const senhaCorreta = "MinhaSenhaReal";
      const hashAutentico = await hashPassword(senhaCorreta);

      // Act
      const valido = await verifyPassword("SenhaFalsa!", hashAutentico);

      // Assert
      expect(valido).toBe(false);
    });

    it("deve falhar adequadamente contra entradas extremas (strings vazias e espaços em branco puros)", async () => {
      // Arrange
      const hash = await hashPassword("senha123");

      // Act
      const caseVazio = await verifyPassword("", hash);
      const caseEspacos = await verifyPassword("   ", hash);

      // Assert
      expect(caseVazio).toBe(false);
      expect(caseEspacos).toBe(false);
    });
    
    it("deve tolerar falhas frente a caracteres Unicode incomuns, emojis e espaços formatados", async () => {
      // Arrange
      const passUnicode = " 🥷🏾s3nh4!@#%¨&*(🚀 ";
      const hashUni = await hashPassword(passUnicode);
      
      // Act
      const valid = await verifyPassword(passUnicode, hashUni);
      const invalid = await verifyPassword(" 🥷🏾s3nh4!@#%¨&*(", hashUni);
      
      // Assert
      expect(valid).toBe(true);
      expect(invalid).toBe(false);
    });

    it("deve garantir compatibilidade nativa de legado quando for passada uma senha em texto claro do antigo banco sem salt", async () => {
      // Arrange
      const senhaPlanaLegada = "senhaDoBancoVelho123";
      
      // Act
      const fallbackSuccess = await verifyPassword(senhaPlanaLegada, senhaPlanaLegada);
      const fallbackFail = await verifyPassword("senhaErrada", senhaPlanaLegada);

      // Assert
      expect(fallbackSuccess).toBe(true);
      expect(fallbackFail).toBe(false);
    });
  });
});
