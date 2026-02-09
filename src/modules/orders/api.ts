import api from "@/api/axios";
import type { Order } from "./types";

export interface OrdersQuery {
  page: number;
  per_page: number;
  search?: string;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
}

export const ordersApi = {
  getAll: (params: OrdersQuery) =>
    api.get<PaginatedOrders>("/orders", { params }),

  getById: (id: number) => api.get<{ data: Order }>(`/orders/${id}`),

  create: (data: any) => api.post("/orders", data),

  update: (id: number, data: any) => api.put(`/orders/${id}`, data),

  delete: (id: number) => api.delete(`/orders/${id}`),
};
