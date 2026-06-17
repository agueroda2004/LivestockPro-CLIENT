import { api } from "@/lib/apiClient";
import type { UserCredentials } from "./auth";
import type { ApiResponse } from "@/types";

export const authApi = {
  login: async (payload: UserCredentials) => {
    const response = await api.post<ApiResponse<{ token: string }>>(
      "/auth/login",
      payload,
    );
    return response.data.data;
  },
};
