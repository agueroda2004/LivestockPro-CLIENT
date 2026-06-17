import { TransactionApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TransactionFilters,
  TransactionPayload,
  TransactionTypes,
} from "../transaction";
import type { ApiErrorResponse, ApiResponse } from "@/types";
import type { AxiosError } from "axios";
import { useState } from "react";

export const TRANSACTION_TYPE_OPTIONS = [
  { text: "Todos", value: "ALL" },
  { text: "Ingreso", value: "INCOME" },
  { text: "Gasto", value: "EXPENSE" },
];
export const TRANSACTION_TYPE_INCOME = [
  { text: "Todos", value: "ALL" },
  { text: "Venta", value: "SALE" },
];
export const TRANSACTION_TYPE_EXPENSE = [
  { text: "Todos", value: "ALL" },
  { text: "Compra", value: "PURCHASE" },
  { text: "Salario", value: "SALARY" },
  { text: "Insumo", value: "SUPPLY" },
];

function getCurrentMonthDates() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  return {
    dateFrom: formatDate(firstDay),
    today: formatDate(now),
  };
}

export default function useTransaction() {
  const QUERY_KEY = "transaction";
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<TransactionFilters>({
    type: TRANSACTION_TYPE_OPTIONS[0].value as TransactionTypes,
    category: "ALL",
    dateFrom: getCurrentMonthDates().dateFrom,
    dateTo: getCurrentMonthDates().today,
  });

  const handleFilterChange = (
    field: keyof TransactionFilters,
    value: string | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [applyFilters, setApplyFilters] = useState<TransactionFilters>({
    type: TRANSACTION_TYPE_OPTIONS[0].value as TransactionTypes,
    category: "ALL",
    dateFrom: getCurrentMonthDates().dateFrom,
    dateTo: getCurrentMonthDates().today,
  });

  const handleClearFilters = () => {
    const monthDates = getCurrentMonthDates();
    setFilters({
      type: TRANSACTION_TYPE_OPTIONS[0].value as TransactionTypes,
      category: "ALL",
      dateFrom: monthDates.dateFrom,
      dateTo: monthDates.today,
    });
    setApplyFilters({
      type: TRANSACTION_TYPE_OPTIONS[0].value as TransactionTypes,
      category: "ALL",
      dateFrom: monthDates.dateFrom,
      dateTo: monthDates.today,
    });
  };

  const handleApplyFilters = () => {
    setApplyFilters(filters);
  };

  const getTransactions = useQuery({
    queryKey: [QUERY_KEY, applyFilters],
    queryFn: () => TransactionApi.getTransactions(1, 10, applyFilters),
  });

  const createTransaction = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    TransactionPayload
  >({
    mutationFn: TransactionApi.createTransaction,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  const updateTransaction = useMutation<
    ApiResponse<{ id: string }>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<TransactionPayload> }
  >({
    mutationFn: ({ id, data }) => TransactionApi.updateTransaction(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  const deleteTransaction = useMutation<
    ApiResponse<null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: TransactionApi.deleteTransaction,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
      ]);
    },
  });

  return {
    filters,
    handleFilterChange,

    TRANSACTION_TYPE_EXPENSE,
    TRANSACTION_TYPE_INCOME,
    setFilters,
    applyFilters,
    handleApplyFilters,
    handleClearFilters,
    transactions: getTransactions.data?.data?.items,

    pagination: getTransactions.data?.data?.pagination,
    isLoadingTransactions: getTransactions.isLoading,

    createTransaction: createTransaction.mutate,
    isCreating: createTransaction.isPending,

    updateTransaction: updateTransaction.mutate,
    isUpdating: updateTransaction.isPending,

    deleteTransaction: deleteTransaction.mutate,
    isDeleting: deleteTransaction.isPending,
  };
}
