import { create } from "zustand";
import { ordersApi } from "./api";
import type { Order, OrderPayload } from "./types";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

type SortOrder = "asc" | "desc";

interface OrdersState {
  orders: Order[];
  total: number;
  loading: boolean;

  page: number;
  perPage: number;

  sort: string;
  order: SortOrder;

  setPagination: (pagination: PaginationState) => void;
  setSorting: (sort: string, order: SortOrder) => void;

  fetchOrders: () => Promise<void>;

  fetchOrderById: (id: number) => Promise<SortOrder>;

  createOrder: (data: OrderPayload) => Promise<void>;
  updateOrder: (id: number, data: OrderPayload) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  total: 0,
  loading: false,

  page: 0,
  perPage: 10,

  sort: "id",
  order: "desc",

  /* ---------------- Pagination ---------------- */
  setPagination: ({ pageIndex, pageSize }) => {
    set({
      page: pageIndex,
      perPage: pageSize,
    });

    get().fetchOrders();
  },

  /* ---------------- Sorting ---------------- */
  setSorting: (sort, order) => {
    set({ sort, order });

    get().fetchOrders();
  },

  /* ---------------- Fetch List ---------------- */
  fetchOrders: async () => {
    const { page, perPage, sort, order } = get();

    set({ loading: true });

    const res = await ordersApi.getAll({
      page: page + 1,
      per_page: perPage,
      sort_field: sort,
      sort_direction: order,
    });

    set({
      orders: res.data.data,
      total: res.data?.meta.total,
      loading: false,
    });
  },

  /* ---------------- Fetch Single ---------------- */
  fetchOrderById: async (id) => {
    set({ loading: true });

    const res = await ordersApi.getById(id);

    set({ loading: false });

    return res.data.data;
  },

  /* ---------------- CRUD ---------------- */
  createOrder: async (data) => {
    await ordersApi.create(data);
    toast.success("Order created successfully");
  },

  updateOrder: async (id, data) => {
    await ordersApi.update(id, data);
    toast.success("Order updated successfully");
  },

  deleteOrder: async (id) => {
    await ordersApi.delete(id);
    await get().fetchOrders();
    toast.success("Order deleted successfully");
  },
}));
