import { api } from "@/lib/apiClient";
import type { Land, LandPayload, LandToDropdown } from "./land";
import type { ApiResponse } from "@/types";

export const landApi = {
  getLands: async () => {
    const response = await api.get<ApiResponse<Land[]>>("/lands");
    return response.data;
  },
  create: async (payload: LandPayload) => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/lands",
      payload,
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ id: string }>>(
      `/lands/${id}`,
    );
    return response.data;
  },
  update: async (id: string, payload: Partial<LandPayload>) => {
    const response = await api.patch<ApiResponse<{ id: string }>>(
      `/lands/${id}`,
      payload,
    );
    return response.data;
  },
  getLandsToDropdown: async () => {
    const response =
      await api.get<ApiResponse<LandToDropdown[]>>("/lands/dropdown");
    return response.data;
  },
};
