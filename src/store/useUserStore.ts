import { create } from "zustand"
import { api } from "@/lib/api"
import type { User } from "@/types/user"

import { toast } from "sonner"


import axios from "axios"

type SortDir = "asc" | "desc"

interface FetchParams {
  page: number
  perPage: number
  q?: string
  status?: string
  role?: string
  sortBy?: string | null
  sortDir?: SortDir
}

interface UserStoreState {
  users: User[]
  total: number
  lastPage: number
  loading: boolean
  error: string | null

  // list with params (search/sort/pagination)
  fetchUsers: (params: FetchParams) => Promise<void>

  // full CRUD
  currentUser: User | null
  fetchUser: (id: number | string) => Promise<void>
  createUser: (payload: Partial<User>) => Promise<User | null>
  updateUser: (
    id: number | string,
    payload: Partial<User>
  ) => Promise<User | null>
  deleteUser: (id: number | string) => Promise<boolean>
}

export const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  total: 0,
  lastPage: 1,
  loading: false,
  error: null,

  currentUser: null,

  // LIST
  fetchUsers: async ({
    page,
    perPage,
    q,
    status,
    role,
    sortBy,
    sortDir,
  }) => {
    set({ loading: true, error: null })

    try {
      const res = await api.get("/users", {
        params: {
          page,
          per_page: perPage,
          search: q || undefined,
          status: status && status !== "all" ? status : undefined,
          role: role && role !== "all" ? role : undefined,
          sort_by: sortBy || undefined,
          sort_dir: sortBy ? sortDir || "asc" : undefined,
        },
      })

      const data = res.data

      set({
        users: data.data ?? data.users ?? [],
        total: data.meta?.total ?? 0,
        lastPage: data.meta?.last_page ?? 1,
      })
    } catch (error) {
      console.error(error)
      set({ error: "Failed to fetch users" })
    } finally {
      set({ loading: false })
    }
  },

  // SHOW
  fetchUser: async (id) => {
    set({ loading: true, error: null })

    try {
      const res = await api.get(`/users/${id}`)
      const user: User = res.data.data ?? res.data
      set({ currentUser: user })
    } catch (error) {
      console.error(error)
      set({ error: "Failed to fetch user" })
    } finally {
      set({ loading: false })
    }
  },

  createUser: async (payload) => {
    set({ loading: true, error: null })

    try {
      const res = await api.post("/users", payload)
      const created: User = res.data.data ?? res.data

      set((state) => ({
        users: [created, ...state.users],
      }))

      return created
    } catch (error: any) {
      console.error(error)

      // 🔴 Server-side validation (Laravel 422)
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data?.errors ?? {}
        // Throw a structured error for the form to catch
        throw { type: "validation", errors: validationErrors }
      }

      set({ error: "Failed to create user" })
      toast(error);
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateUser: async (id, payload) => {
    set({ loading: true, error: null })

    try {
      const res = await api.put(`/users/${id}`, payload)
      const updated: User = res.data.data ?? res.data

      set((state) => ({
        users: state.users.map((u) => (u.id === updated.id ? updated : u)),
        currentUser:
          state.currentUser && state.currentUser.id === updated.id
            ? updated
            : state.currentUser,
      }))

      toast("User Updated Successfully!!!");

      return updated
    } catch (error: any) {
      console.error(error)

      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data?.errors ?? {}
        throw { type: "validation", errors: validationErrors }
      }

      set({ error: "Failed to update user" })
      throw error
    } finally {
      set({ loading: false })
    }
  },


  // DELETE
  deleteUser: async (id) => {
    set({ loading: true, error: null })

    try {
      await api.delete(`/users/${id}`)

      set((state) => ({
        users: state.users.filter((u) => u.id !== Number(id)),
      }))

      return true
    } catch (error) {
      console.error(error)
      set({ error: "Failed to delete user" })
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
