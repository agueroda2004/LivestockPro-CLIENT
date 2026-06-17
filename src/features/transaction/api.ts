import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type {
  TransactionFilters,
  TransactionPayload,
  PaginatedTransactionResponse,
} from "./transaction";

export const TransactionApi = {
  getTransactions: async (
    page: number,
    limit: number,
    filters: TransactionFilters,
  ) => {
    const dateFrom = filters.dateFrom?.replace(/\//g, "-");
    const dateTo = filters.dateTo?.replace(/\//g, "-") + "T23:59:59.999Z";

    const response = await api.get<ApiResponse<PaginatedTransactionResponse>>(
      `/transactions?type=${filters.type}&category=${filters.category ? filters.category : "ALL"}&page=${page}&limit=${limit}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    );
    return response.data;
  },
  createTransaction: async (data: TransactionPayload) => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/transactions",
      data,
    );
    return response.data;
  },
  updateTransaction: async (id: string, data: Partial<TransactionPayload>) => {
    const response = await api.patch<ApiResponse<{ id: string }>>(
      `/transactions/${id}`,
      data,
    );
    return response.data;
  },
  deleteTransaction: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/transactions/${id}`);
    return response.data;
  },
};
