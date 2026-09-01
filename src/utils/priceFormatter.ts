/**
 * Utilidades para el formateo de monedas y precios.
 */

/**
 * Formatea un número como moneda en pesos colombianos (COP).
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price || 0);
};

