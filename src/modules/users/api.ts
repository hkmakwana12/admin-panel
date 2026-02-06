import api from "@/api/axios";
import type { User } from "./types";

export interface UsersQuery {
  page: number;
  per_page: number;
  search?: string;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
}

export interface PaginatedUsers {
  data: User[];
  total: number;
}

export const usersApi = {
  getAll: (params: UsersQuery) => api.get<PaginatedUsers>("/users", { params }),

  create: (data: any) => api.post("/users", data),

  update: (id: number, data: any) => api.put(`/users/${id}`, data),

  delete: (id: number) => api.delete(`/users/${id}`),
};
