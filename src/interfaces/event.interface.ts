import type { Category } from "./category.interface";

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: Date;
  location: string;
  price: number;
  capacity: number,
  categoryId: string;
  category?: Category;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEvent {
  name: string;
  description?: string;
  date: Date;
  location: string;
  price: number;
  capacity: number,
  categoryId: string;
  images?: string[];
}

export interface UpdateEvent {
  name?: string;
  description?: string;
  date?: Date;
  location?: string;
  price?: number;
  capacity?: number,
  categoryId?: string;
  images?: string[];
}

export interface EventQuery {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}