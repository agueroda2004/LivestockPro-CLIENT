import type { ApiErrorResponse, ApiResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Race, RacePayload, RaceToDropdown } from "../race";
import type { AxiosError } from "axios";
import { raceApi } from "../api";

export default function useRace() {
  const QUERY_KEY = "races";
  const queryClient = useQueryClient();

  const getRaces = useQuery<ApiResponse<Race[]>, AxiosError<ApiErrorResponse>>({
    queryKey: [QUERY_KEY],
    queryFn: raceApi.getRaces,
  });

  const createRace = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    RacePayload
  >({
    mutationFn: raceApi.create,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const deleteRace = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: raceApi.delete,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const updateRace = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<RacePayload> }
  >({
    mutationFn: ({ id, data }) => raceApi.update(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dropdown"] }),
      ]);
    },
  });

  const getRacesToDropdown = useQuery<
    ApiResponse<RaceToDropdown[]>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: [QUERY_KEY, "dropdown"],
    queryFn: raceApi.getRacesToDropdown,
  });

  return {
    getRaces: getRaces.data,
    isLoadingRaces: getRaces.isLoading,

    createRace: createRace.mutate,
    isCreating: createRace.isPending,

    deleteRace: deleteRace.mutate,
    isDeleting: deleteRace.isPending,

    updateRace: updateRace.mutate,
    isUpdating: updateRace.isPending,

    getRacesToDropdown: getRacesToDropdown.data,
  };
}
