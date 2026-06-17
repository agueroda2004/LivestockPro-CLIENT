import { CattleApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CattleMovementPayload } from "../cattle";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import type { AxiosError } from "axios";

export default function useCattleMovement() {
  const queryClient = useQueryClient();

  const createMovement = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    { cattleId: string; data: CattleMovementPayload }
  >({
    mutationFn: ({ cattleId, data }) =>
      CattleApi.createCattleMovement(cattleId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cattle"] }),
        queryClient.invalidateQueries({ queryKey: ["lands"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  return {
    createMovement: createMovement.mutate,
    isCreating: createMovement.isPending,
  };
}
