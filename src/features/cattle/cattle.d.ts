import { z } from "zod";
import type {
  createCattleSchema,
  createCattleMovementSchema,
} from "./cattle.schema";
import type { PaginationResult } from "@/types";

export type CattlePayload = z.infer<typeof createCattleSchema>;
export type CattleError = Partial<Record<keyof CattlePayload, string>>;

export type CattleMovementPayload = z.infer<typeof createCattleMovementSchema>;
export type CattleMovementError = Partial<
  Record<keyof CattleMovementPayload, string>
>;

export type CattleMovementType = "MOVED" | "SOLD" | "DIED" | "TRANSFERRED";

export const CATTLE_MOVEMENT_LABELS: Record<CattleMovementType, string> = {
  MOVED: "Mover de finca",
  SOLD: "Venta",
  DIED: "Fallecimiento",
  TRANSFERRED: "Traslado",
};

export type Cattle = {
  id: string;
  name: string;
  gender: string;
  race: {
    id: string;
    name: string;
  };
  land: {
    id: string;
    name: string;
  };
};

export type CattleFilters = {
  search: string;
  gender: string;
  landId: string;
  raceId: string;
};

export type PaginatedCattleResponse = {
  items: Cattle[];
  pagination: PaginationResult;
};
