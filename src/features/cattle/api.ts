import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type {
  CattleFilters,
  CattleMovementPayload,
  CattlePayload,
  PaginatedCattleResponse,
} from "./cattle";

export const CattleApi = {
  getCattles: async (page: number, limit: number, filters: CattleFilters) => {
    const response = await api.get<ApiResponse<PaginatedCattleResponse>>(
      `/cattles?page=${page}&limit=${limit}&search=${filters.search}&gender=${filters.gender}&raceId=${filters.raceId}&landId=${filters.landId}`,
    );
    return response.data;
  },
  createCattle: async (data: CattlePayload) => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/cattles",
      data,
    );
    return response.data;
  },
  updateCattle: async (id: string, data: Partial<CattlePayload>) => {
    const response = await api.patch<ApiResponse<{ id: string }>>(
      `/cattles/${id}`,
      data,
    );
    return response.data;
  },
  deleteCattle: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/cattles/${id}`);
    return response.data;
  },
  createCattleMovement: async (
    cattleId: string,
    data: CattleMovementPayload,
  ) => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      `/cattles/${cattleId}/movements`,
      data,
    );
    return response.data;
  },
};
