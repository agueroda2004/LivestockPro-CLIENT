import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { Race, RacePayload, RaceToDropdown } from "./race";

export const raceApi = {
  getRaces: async () => {
    const response = await api.get<ApiResponse<Race[]>>("/races");
    return response.data;
  },
  create: async (payload: RacePayload) => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/races",
      payload,
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ id: string }>>(
      `/races/${id}`,
    );
    return response.data;
  },
  update: async (id: string, payload: Partial<RacePayload>) => {
    const response = await api.patch<ApiResponse<{ id: string }>>(
      `/races/${id}`,
      payload,
    );
    return response.data;
  },
  getRacesToDropdown: async () => {
    const response =
      await api.get<ApiResponse<RaceToDropdown[]>>("/races/dropdown");
    return response.data;
  },
};
