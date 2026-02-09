import api from "@/api/axios";
import type { Product } from "./types";

export interface ProductsQuery {
  page: number;
  per_page: number;
  search?: string;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
}

export const productsApi = {
  getAll: (params: ProductsQuery) =>
    api.get<PaginatedProducts>("/products", { params }),

  getById: (id: number) => api.get<{ data: Product }>(`/products/${id}`),

  create: (data: any) => api.post("/products", data),

  update: (id: number, data: any) => api.put(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),
};
