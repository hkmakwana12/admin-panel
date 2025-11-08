// src/stores/auth-store.ts
import { create } from "zustand";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("admin_token"),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem("admin_token");
    set({ user: null, isAuthenticated: false });
  },
}));
