import { z } from "zod";

export const createLandSchema = z.object({
  name: z
    .string()
    .nonempty("El nombre es requerido")
    .min(1, "El nombre debe tener al menos 1 carácter")
    .max(255, "El nombre debe tener menos de 255 caracteres"),
  ubication: z
    .string()
    .nonempty("La ubicación es requerida")
    .min(1, "La ubicación debe tener al menos 1 carácter")
    .max(255, "La ubicación debe tener menos de 255 caracteres"),
  isRented: z.boolean().optional(),
  active: z.boolean().optional(),
});
