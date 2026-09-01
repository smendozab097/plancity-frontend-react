/**
 * Utilidades para el manejo y formateo de fechas.
 */

/**
 * Convierte un valor de fecha (string en formato YYYY-MM-DD, ISO string o Date) en un objeto Date válido sin problemas de desfase horario.
 */
export const parseDate = (dateValue?: string | Date | null): Date | null => {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }

  if (typeof dateValue === "string") {
    const trimmed = dateValue.trim();
    if (!trimmed) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

/**
 * Formatea una fecha a formato legible en español (ej. "15 de mayo de 2025" o "15 de mayo").
 */
export const formatDate = (
  dateValue?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string => {
  if (!dateValue) return "";

  const d = parseDate(dateValue);
  if (!d) return String(dateValue);

  return new Intl.DateTimeFormat("es-CO", options).format(d);
};

/**
 * Determina si la fecha de un evento ya ha expirado (pasada en comparación con la fecha/hora actual).
 * Si la fecha solo contiene año-mes-día, se asume el final del día correspondiente (23:59:59.999).
 */
export const isEventExpired = (dateValue?: string | Date | null): boolean => {
  if (!dateValue) return false;

  let eventDate: Date | null;
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue.trim())) {
    const [year, month, day] = dateValue.trim().split("-").map(Number);
    eventDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  } else {
    eventDate = parseDate(dateValue);
  }

  if (!eventDate || isNaN(eventDate.getTime())) return false;
  return eventDate.getTime() < Date.now();
};

/**
 * Formatea una fecha al formato estándar de input tipo date (YYYY-MM-DD).
 */
export const formatDateForInput = (dateValue?: string | Date | null): string => {
  const d = parseDate(dateValue);
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

