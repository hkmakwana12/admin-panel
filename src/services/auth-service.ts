// src/services/auth-service.ts
import { apiClient } from "../lib/api-client";
import { AuthResponse, LoginData, User } from "../types";

export const authService = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/login", credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/user");
    return data;
  },
};
