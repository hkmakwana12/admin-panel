// src/services/users-service.ts
import { apiClient } from "../lib/api-client";
import type { User, PaginatedResponse } from "../types";

export interface UsersQuery {
  page?: number;
  search?: string;
  role?: string;
  status?: string;
  sort_field?: string;
  sort_direction?: string;
}

export const usersService = {
  getUsers: async (
    query: UsersQuery = {}
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users", {
      params: query,
    });
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.post<User>("/users", userData);
    return data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  bulkActions: async (ids: string[], action: string): Promise<void> => {
    await apiClient.post("/users/bulk-actions", { ids, action });
  },
};
