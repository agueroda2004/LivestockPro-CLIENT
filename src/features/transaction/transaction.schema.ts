import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "El tipo de transacción es requerido",
  }),
  category: z.enum(["SALE", "PURCHASE", "SALARY", "SUPPLY"], {
    message: "La categoría es requerida",
  }),
  amount: z
    .string()
    .nonempty("El monto es requerido")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "El monto debe ser un número mayor a 0" },
    ),
  date: z
    .string()
    .min(1, "La fecha es requerida")
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, "El formato debe ser YYYY/MM/DD")
    .refine(
      (val) => {
        const [year, month, day] = val.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day &&
          date <= today
        );
      },
      { message: "Fecha inválida o futura" },
    ),
  description: z
    .string()
    .nonempty("La descripción es requerida")
    .min(1, "La descripción debe tener al menos 1 carácter")
    .max(500, "La descripción debe tener menos de 500 caracteres"),
});
