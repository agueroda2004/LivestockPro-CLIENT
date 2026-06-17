import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Land, LandPayload, LandToDropdown } from "../land";
import { landApi } from "../api";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import type { AxiosError } from "axios";

export default function useLand() {
  const QUERY_KEY = "lands";
  const queryClient = useQueryClient();

  const getLands = useQuery<ApiResponse<Land[]>, AxiosError<ApiErrorResponse>>({
    queryKey: [QUERY_KEY],
    queryFn: landApi.getLands,
  });

  const createLand = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    LandPayload
  >({
    mutationFn: landApi.create,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const deleteLand = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: landApi.delete,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const updateLand = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<LandPayload> }
  >({
    mutationFn: ({ id, data }) => landApi.update(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const getLandsToDropdown = useQuery<
    ApiResponse<LandToDropdown[]>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: [QUERY_KEY, "dropdown"],
    queryFn: landApi.getLandsToDropdown,
  });

  return {
    createLand: createLand.mutateAsync,
    isCreating: createLand.isPending,

    deleteLand: deleteLand.mutateAsync,
    isDeleting: deleteLand.isPending,

    updateLand: updateLand.mutateAsync,
    isUpdating: updateLand.isPending,

    getLands: getLands.data,
    isLoadingLands: getLands.isLoading,

    getLandsToDropdown: getLandsToDropdown.data,
    isLoadingLandsToDropdown: getLandsToDropdown.isLoading,
  };
}
