import api from "@/api/axios";
import type { Category } from "./types";

export interface CategoriesQuery {
  page: number;
  per_page: number;
  search?: string;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
}

export interface PaginatedCategories {
  data: Category[];
  total: number;
}

export const categoriesApi = {
  getAll: (params: CategoriesQuery) =>
    api.get<PaginatedCategories>("/categories", { params }),

  getOptions: () =>
    api.get("/categories", {
      params: { page: 1, per_page: 1000 },
    }),

  create: (data: any) => api.post("/categories", data),

  update: (id: number, data: any) => api.put(`/categories/${id}`, data),

  delete: (id: number) => api.delete(`/categories/${id}`),
};
