import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { DashboardFilters, DashboardStats } from "./dashboard";

export const DashboardApi = {
  getStats: async (filters: DashboardFilters) => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.landId) params.append("landId", filters.landId);

    const response = await api.get<ApiResponse<DashboardStats>>(
      `/dashboard/stats?${params.toString()}`,
    );
    return response.data;
  },
};
