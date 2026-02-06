import { create } from "zustand";
import { categoriesApi } from "./api";
import type { Category, CategoryPayload } from "./types";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

type Order = "asc" | "desc";

interface CategoriesState {
  categories: Category[];
  total: number;
  loading: boolean;

  page: number;
  perPage: number;

  sort: string;
  order: Order;

  selectedCategory: Category | null;

  setSelectedCategory: (category: Category | null) => void;

  // ✅ FIXED: accept TanStack shape directly
  setPagination: (pagination: PaginationState) => void;

  setSorting: (sort: string, order: Order) => void;

  fetchCategories: () => Promise<void>;

  createCategory: (data: CategoryPayload) => Promise<void>;
  updateCategory: (id: number, data: CategoryPayload) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  total: 0,
  loading: false,

  page: 0,
  perPage: 10,

  sort: "id",
  order: "desc",

  selectedCategory: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  /* -------------------------------------------------
     ✅ FIXED PAGINATION (TanStack compatible)
  ------------------------------------------------- */
  setPagination: ({ pageIndex, pageSize }) => {
    set({
      page: pageIndex,
      perPage: pageSize,
    });

    // immediately refetch when pagination changes
    get().fetchCategories();
  },

  /* -------------------------------------------------
     SORTING
  ------------------------------------------------- */
  setSorting: (sort, order) => {
    set({ sort, order });

    // immediately refetch when sorting changes
    get().fetchCategories();
  },

  /* -------------------------------------------------
     FETCH
  ------------------------------------------------- */
  fetchCategories: async () => {
    const { page, perPage, sort, order } = get();

    set({ loading: true });

    const res = await categoriesApi.getAll({
      page: page + 1, // API is 1-based
      per_page: perPage,
      sort_field: sort,
      sort_direction: order,
    });

    set({
      categories: res.data.data,
      total: res.data?.meta.total,
      loading: false,
    });
  },

  /* -------------------------------------------------
     CRUD
  ------------------------------------------------- */
  createCategory: async (data) => {
    await categoriesApi.create(data);
    await get().fetchCategories();

    toast.success("Category created successfully");
  },

  updateCategory: async (id, data) => {
    await categoriesApi.update(id, data);
    await get().fetchCategories();

    toast.success("Category updated successfully");
  },

  deleteCategory: async (id) => {
    await categoriesApi.delete(id);
    await get().fetchCategories();

    toast.success("Category deleted successfully");
  },
}));
