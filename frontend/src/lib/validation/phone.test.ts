import { describe, it, expect } from "vitest";
import { isValidPhone } from "./phone";

describe("Validation: phone", () => {
  it("deve retornar true para telefones móveis com DDD válidos", () => {
    expect(isValidPhone("(11) 98765-4321")).toBe(true);
  });

  it("deve retornar true para telefones fixos com DDD válidos", () => {
    expect(isValidPhone("(11) 4002-8922")).toBe(true);
  });

  it("deve retornar false para telefones curtos demais", () => {
    expect(isValidPhone("(11) 1234")).toBe(false);
  });

  it("deve retornar false para formatos totalmente errados", () => {
    expect(isValidPhone("11 9abc-defg")).toBe(false);
    expect(isValidPhone("() -")).toBe(false);
  });
});
