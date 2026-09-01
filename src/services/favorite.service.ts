import apiClient from "./apiClient";
import { AppError } from "../utils/appError";
import type { Event } from "../interfaces/event.interface";

/**
 * Listar los eventos favoritos del usuario autenticado (requiere JWT)
 */
export async function getAllFavorites(): Promise<Event[]> {
  try {
    const response = await apiClient.get<Event[]>("/favorites");
    return response.data;
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Agregar un evento a favoritos (requiere JWT)
 */
export async function addFavorite(eventId: string): Promise<void> {
  try {
    await apiClient.post(`/favorites/${eventId}`);
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Quitar un evento de favoritos (requiere JWT)
 */
export async function removeFavorite(eventId: string): Promise<void> {
  try {
    await apiClient.delete(`/favorites/${eventId}`);
  } catch (error) {
    throw new AppError(error);
  }
}