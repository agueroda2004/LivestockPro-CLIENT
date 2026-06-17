import { z } from "zod";
import { createLandSchema } from "./land.schema";

export type LandPayload = z.infer<typeof createLandSchema>;
export type LandError = Partial<Record<keyof LandPayload, string>>;

export type LandToDropdown = {
  id: string;
  name: string;
};

export type Land = {
  id: string;
  active: boolean;
  isRented: boolean;
  name: string;
  ubication: string;
  _count: {
    Cattles: number;
  };
};
