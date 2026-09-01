import { describe, expect, it } from "vitest";
import { formatDate, formatDateForInput, isEventExpired, parseDate } from "../utils/dateFormatter";

describe("dateFormatter utils", () => {
  describe("parseDate", () => {
    it("debe retornar null para valores nulos, indefinidos o vacíos", () => {
      expect(parseDate(null)).toBeNull();
      expect(parseDate(undefined)).toBeNull();
      expect(parseDate("")).toBeNull();
      expect(parseDate("   ")).toBeNull();
    });

    it("debe procesar correctamente un string con formato YYYY-MM-DD sin desfase horario", () => {
      const date = parseDate("2026-12-25");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(25);
    });

    it("debe procesar una instancia de Date válida", () => {
      const original = new Date(2026, 5, 15);
      const parsed = parseDate(original);
      expect(parsed).toEqual(original);
    });

    it("debe retornar null para fechas inválidas", () => {
      expect(parseDate("fecha-invalida")).toBeNull();
      expect(parseDate(new Date("invalid"))).toBeNull();
    });
  });

  describe("formatDate", () => {
    it("debe retornar string vacío para valores nulos o vacíos", () => {
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
      expect(formatDate("")).toBe("");
    });

    it("debe formatear la fecha correctamente en español", () => {
      const formatted = formatDate("2026-05-15");
      expect(formatted).toContain("15");
      expect(formatted.toLowerCase()).toContain("mayo");
      expect(formatted).toContain("2026");
    });

    it("debe retornar la representación en string si la fecha no es válida", () => {
      expect(formatDate("no-es-fecha")).toBe("no-es-fecha");
    });
  });

  describe("isEventExpired", () => {
    it("debe retornar false si no se proporciona fecha o es inválida", () => {
      expect(isEventExpired(null)).toBe(false);
      expect(isEventExpired(undefined)).toBe(false);
      expect(isEventExpired("invalido")).toBe(false);
    });

    it("debe retornar true para fechas pasadas", () => {
      expect(isEventExpired("2000-01-01")).toBe(true);
    });

    it("debe retornar false para fechas futuras lejanas", () => {
      expect(isEventExpired("2099-12-31")).toBe(false);
    });
  });

  describe("formatDateForInput", () => {
    it("debe retornar string vacío para valores inválidos o nulos", () => {
      expect(formatDateForInput(null)).toBe("");
      expect(formatDateForInput(undefined)).toBe("");
      expect(formatDateForInput("invalido")).toBe("");
    });

    it("debe retornar formato YYYY-MM-DD", () => {
      const d = new Date(2026, 3, 9);
      expect(formatDateForInput(d)).toBe("2026-04-09");
      expect(formatDateForInput("2026-04-09")).toBe("2026-04-09");
    });
  });
});

