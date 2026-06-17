import { CattleApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CattleFilters, CattlePayload } from "../cattle";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import type { AxiosError } from "axios";
import { useState } from "react";

const GENDER_OPTIONS = [
  { text: "Todos", value: "ALL" },
  { text: "Hembras", value: "FEMALE" },
  { text: "Machos", value: "MALE" },
];

export default function useCattle() {
  const QUERY_KEY = "cattle";
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<CattleFilters>({
    search: "",
    gender: GENDER_OPTIONS[0].value,
    landId: "",
    raceId: "",
  });

  const [applyFilters, setApplyFilters] = useState<CattleFilters>({
    search: "",
    gender: GENDER_OPTIONS[0].value,
    landId: "",
    raceId: "",
  });

  const handleClearFilters = () => {
    setFilters({
      search: "",
      gender: GENDER_OPTIONS[0].value,
      landId: "",
      raceId: "",
    });
    setApplyFilters({
      search: "",
      gender: GENDER_OPTIONS[0].value,
      landId: "",
      raceId: "",
    });
  };

  const handleApplyFilters = () => {
    setApplyFilters(filters);
  };

  const getCattle = useQuery({
    queryKey: [QUERY_KEY, applyFilters],
    queryFn: () => CattleApi.getCattles(1, 10, applyFilters),
  });

  const createCattle = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    CattlePayload
  >({
    mutationFn: CattleApi.createCattle,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["lands"] }),
        queryClient.invalidateQueries({ queryKey: ["races"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  const updateCattle = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<CattlePayload> }
  >({
    mutationFn: ({ id, data }) => CattleApi.updateCattle(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["lands"] }),
        queryClient.invalidateQueries({ queryKey: ["races"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  const deleteCattle = useMutation<
    ApiResponse<null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: CattleApi.deleteCattle,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["lands"] }),
        queryClient.invalidateQueries({ queryKey: ["races"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  return {
    GENDER_OPTIONS,
    filters,
    setFilters,
    applyFilters,
    handleApplyFilters,
    handleClearFilters,
    cattles: getCattle.data?.data?.items,
    pagination: getCattle.data?.data?.pagination,
    isLoadingCattle: getCattle.isLoading,

    createCattle: createCattle.mutate,
    isCreating: createCattle.isPending,

    updateCattle: updateCattle.mutate,
    isUpdating: updateCattle.isPending,

    deleteCattle: deleteCattle.mutate,
    isDeleting: deleteCattle.isPending,
  };
}
