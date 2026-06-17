import { z } from "zod";

export const createCattleSchema = z.object({
  name: z
    .string()
    .nonempty("El ID es requerido")
    .min(1, "El ID debe tener al menos 1 carácter")
    .max(20, "El ID debe tener menos de 20 caracteres"),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "El género es requerido",
  }),
  landId: z.string().nonempty("La finca es requerida"),
  raceId: z.string().nonempty("La raza es requerida"),
});

export const createCattleMovementSchema = z
  .object({
    type: z.enum(["MOVED", "SOLD", "DIED", "TRANSFERRED"], {
      message: "El tipo es requerido",
    }),
    fromLandId: z.string().nonempty("La finca de origen es requerida"),
    toLandId: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (val) => {
      if (val.type === "MOVED") {
        return (
          val.toLandId !== undefined &&
          val.toLandId !== "" &&
          val.toLandId !== val.fromLandId
        );
      }
      return true;
    },
    {
      message: "Selecciona una finca de destino diferente",
      path: ["toLandId"],
    },
  );
