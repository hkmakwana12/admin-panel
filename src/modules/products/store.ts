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

  selectedProduct: Product | null;

  setSelectedProduct: (product: Product | null) => void;

  // ✅ FIXED: accept TanStack shape directly
  setPagination: (pagination: PaginationState) => void;

  setSorting: (sort: string, order: Order) => void;

  fetchProducts: () => Promise<void>;

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

  selectedProduct: null,

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  /* -------------------------------------------------
     ✅ FIXED PAGINATION (TanStack compatible)
  ------------------------------------------------- */
  setPagination: ({ pageIndex, pageSize }) => {
    set({
      page: pageIndex,
      perPage: pageSize,
    });

    // immediately refetch when pagination changes
    get().fetchProducts();
  },

  /* -------------------------------------------------
     SORTING
  ------------------------------------------------- */
  setSorting: (sort, order) => {
    set({ sort, order });

    // immediately refetch when sorting changes
    get().fetchProducts();
  },

  /* -------------------------------------------------
     FETCH
  ------------------------------------------------- */
  fetchProducts: async () => {
    const { page, perPage, sort, order } = get();

    set({ loading: true });

    const res = await productsApi.getAll({
      page: page + 1, // API is 1-based
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

  /* -------------------------------------------------
     CRUD
  ------------------------------------------------- */
  createProduct: async (data) => {
    await productsApi.create(data);
    await get().fetchProducts();

    toast.success("Product created successfully");
  },

  updateProduct: async (id, data) => {
    await productsApi.update(id, data);
    await get().fetchProducts();

    toast.success("Product updated successfully");
  },

  deleteProduct: async (id) => {
    await productsApi.delete(id);
    await get().fetchProducts();

    toast.success("Product deleted successfully");
  },
}));
