import { describe, expect, it } from "vitest";
import { formatPrice } from "../utils/priceFormatter";

describe("priceFormatter utils", () => {
  it("debe formatear números como moneda COP", () => {
    const formatted = formatPrice(50000);
    expect(formatted).toContain("50.000");
  });

  it("debe manejar el valor 0 de manera correcta", () => {
    const formatted = formatPrice(0);
    expect(formatted).toContain("0");
  });
});

