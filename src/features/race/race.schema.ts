import z from "zod";

export const createRaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  active: z.boolean().optional(),
});
