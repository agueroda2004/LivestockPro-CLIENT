import { z } from "zod";
import type { createTransactionSchema } from "./transaction.schema";
import type { PaginationResult } from "@/types";

export type TransactionPayload = z.infer<typeof createTransactionSchema>;
export type TransactionError = Partial<
  Record<keyof TransactionPayload, string>
>;

export type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: "SALE" | "PURCHASE" | "SALARY" | "SUPPLY";
  amount: number;
  date: string;
  description: string;
};

export type TransactionFilters = {
  type?: "INCOME" | "EXPENSE" | "ALL";
  category?: "SALE" | "PURCHASE" | "SALARY" | "SUPPLY" | "ALL";
  dateFrom?: string;
  dateTo?: string;
};

export type PaginatedTransactionResponse = {
  items: Transaction[];
  pagination: PaginationResult;
};

export type TransactionTypes = "INCOME" | "EXPENSE" | "ALL";
