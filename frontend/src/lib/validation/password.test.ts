import { describe, it, expect } from "vitest";
import { isValidPassword } from "./password";

describe("Validation: password", () => {
  it("deve retornar true para senhas fortes", () => {
    expect(isValidPassword("Senha@123")).toBe(true);
    expect(isValidPassword("Tr0ub4dor&3")).toBe(true);
  });

  it("deve falhar se for muito curta", () => {
    expect(isValidPassword("Ab@12")).toBe(false);
  });

  it("deve falhar se não tiver letra maiúscula", () => {
    expect(isValidPassword("senha@123")).toBe(false);
  });

  it("deve falhar se não tiver número", () => {
    expect(isValidPassword("Senha@Forte")).toBe(false);
  });

  it("deve falhar se não tiver caractere especial", () => {
    expect(isValidPassword("Senha1234")).toBe(false);
  });
});
