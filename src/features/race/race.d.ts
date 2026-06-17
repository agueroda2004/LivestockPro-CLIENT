import type z from "zod";
import type { createRaceSchema } from "./race.schema";

export type RacePayload = z.infer<typeof createRaceSchema>;
export type RaceError = Partial<Record<keyof RacePayload, string>>;

export type Race = {
  id: string;
  name: string;
  active: boolean;
  _count: {
    Cattles: number;
  };
};

export type RaceToDropdown = {
  id: string;
  name: string;
};
