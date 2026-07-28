import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isValidDate, isFutureOrTodayDate } from "./date";

describe("Validation: date", () => {
  beforeEach(() => {
    // Mock current date to be predictable (2026-07-28)
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-28T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isValidDate", () => {
    it("deve retornar true para datas válidas (DD/MM/AAAA)", () => {
      expect(isValidDate("15/08/2026")).toBe(true);
      expect(isValidDate("01/01/2020")).toBe(true);
    });

    it("deve retornar false para datas inválidas", () => {
      expect(isValidDate("32/01/2026")).toBe(false); // dia inválido
      expect(isValidDate("15/13/2026")).toBe(false); // mês inválido
      expect(isValidDate("abc")).toBe(false);
      expect(isValidDate("")).toBe(false);
    });
  });

  describe("isFutureOrTodayDate", () => {
    it("deve retornar true para data futura", () => {
      expect(isFutureOrTodayDate("29/07/2026")).toBe(true);
      expect(isFutureOrTodayDate("15/08/2026")).toBe(true);
    });

    it("deve retornar true para a data de hoje", () => {
      expect(isFutureOrTodayDate("28/07/2026")).toBe(true);
    });

    it("deve retornar false para data passada", () => {
      expect(isFutureOrTodayDate("27/07/2026")).toBe(false);
      expect(isFutureOrTodayDate("01/01/2025")).toBe(false);
    });

    it("deve lidar com a string especial de fallback", () => {
      expect(isFutureOrTodayDate("O mais rápido possível")).toBe(true);
    });
  });
});
