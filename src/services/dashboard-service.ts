// src/services/dashboard-service.ts
import { apiClient } from "../lib/api-client";
import { DashboardStats } from "../types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
    return data;
  },
};
