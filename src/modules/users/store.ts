import { create } from "zustand";
import { usersApi } from "./api";
import type { User, UserPayload } from "./types";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

type Order = "asc" | "desc";

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;

  page: number;
  perPage: number;

  sort: string;
  order: Order;

  selectedUser: User | null;

  setSelectedUser: (user: User | null) => void;

  // ✅ FIXED: accept TanStack shape directly
  setPagination: (pagination: PaginationState) => void;

  setSorting: (sort: string, order: Order) => void;

  fetchUsers: () => Promise<void>;

  createUser: (data: UserPayload) => Promise<void>;
  updateUser: (id: number, data: UserPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,

  page: 0,
  perPage: 10,

  sort: "id",
  order: "desc",

  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  /* -------------------------------------------------
     ✅ FIXED PAGINATION (TanStack compatible)
  ------------------------------------------------- */
  setPagination: ({ pageIndex, pageSize }) => {
    set({
      page: pageIndex,
      perPage: pageSize,
    });

    // immediately refetch when pagination changes
    get().fetchUsers();
  },

  /* -------------------------------------------------
     SORTING
  ------------------------------------------------- */
  setSorting: (sort, order) => {
    set({ sort, order });

    // immediately refetch when sorting changes
    get().fetchUsers();
  },

  /* -------------------------------------------------
     FETCH
  ------------------------------------------------- */
  fetchUsers: async () => {
    const { page, perPage, sort, order } = get();

    set({ loading: true });

    const res = await usersApi.getAll({
      page: page + 1, // API is 1-based
      per_page: perPage,
      sort_field: sort,
      sort_direction: order,
    });

    set({
      users: res.data.data,
      total: res.data?.meta.total,
      loading: false,
    });
  },

  /* -------------------------------------------------
     CRUD
  ------------------------------------------------- */
  createUser: async (data) => {
    await usersApi.create(data);
    await get().fetchUsers();

    toast.success("User created successfully");
  },

  updateUser: async (id, data) => {
    await usersApi.update(id, data);
    await get().fetchUsers();

    toast.success("User updated successfully");
  },

  deleteUser: async (id) => {
    await usersApi.delete(id);
    await get().fetchUsers();

    toast.success("User deleted successfully");
  },
}));
