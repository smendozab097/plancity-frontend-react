import apiClient from "./apiClient";
import { AppError } from "../utils/appError";
import type {
  Event,
  CreateEvent,
  UpdateEvent,
  EventQuery,
} from "../interfaces/event.interface";

/**
 * Listar Eventos
 */
export async function getAllEvents(query?: EventQuery): Promise<Event[]> {
  try {
    const response = await apiClient.get<Event[]>("/events", {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Obtener el detalle de un Evento por ID
 */
export async function getEventById(id: string): Promise<Event> {
  try {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Crear un nuevo Evento (requiere JWT)
 */
export async function createEvent(data: CreateEvent): Promise<Event> {
  try {
    const response = await apiClient.post<Event>("/events", data);
    return response.data;
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Actualizar un Evento existente (requiere JWT)
 */
export async function updateEvent(id: string, data: UpdateEvent): Promise<Event> {
  try {
    const response = await apiClient.patch<Event>(`/events/${id}`, data);
    return response.data;
  } catch (error) {
    throw new AppError(error);
  }
}

/**
 * Eliminar un Evento por ID (requiere JWT)
 */
export async function deleteEvent(id: string): Promise<void> {
  try {
    await apiClient.delete(`/events/${id}`);
  } catch (error) {
    throw new AppError(error);
  }
}