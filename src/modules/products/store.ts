import { create } from "zustand";
import { productsApi } from "./api";
import type { Product, ProductPayload } from "./types";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

type Order = "asc" | "desc";

interface ProductsState {
  products: Product[];
  total: number;
  loading: boolean;

  page: number;
  perPage: number;

  sort: string;
  order: Order;

  setPagination: (pagination: PaginationState) => void;
  setSorting: (sort: string, order: Order) => void;

  fetchProducts: () => Promise<void>;

  fetchProductById: (id: number) => Promise<Product>;

  createProduct: (data: ProductPayload) => Promise<void>;
  updateProduct: (id: number, data: ProductPayload) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
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

    get().fetchProducts();
  },

  /* ---------------- Sorting ---------------- */
  setSorting: (sort, order) => {
    set({ sort, order });

    get().fetchProducts();
  },

  /* ---------------- Fetch List ---------------- */
  fetchProducts: async () => {
    const { page, perPage, sort, order } = get();

    set({ loading: true });

    const res = await productsApi.getAll({
      page: page + 1,
      per_page: perPage,
      sort_field: sort,
      sort_direction: order,
    });

    set({
      products: res.data.data,
      total: res.data?.meta.total,
      loading: false,
    });
  },

  /* ---------------- Fetch Single ---------------- */
  fetchProductById: async (id) => {
    set({ loading: true });

    const res = await productsApi.getById(id);

    set({ loading: false });

    return res.data.data;
  },

  /* ---------------- CRUD ---------------- */
  createProduct: async (data) => {
    await productsApi.create(data);
    toast.success("Product created successfully");
  },

  updateProduct: async (id, data) => {
    await productsApi.update(id, data);
    toast.success("Product updated successfully");
  },

  deleteProduct: async (id) => {
    await productsApi.delete(id);
    await get().fetchProducts();
    toast.success("Product deleted successfully");
  },
}));
