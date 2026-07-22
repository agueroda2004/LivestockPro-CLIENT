import CustomDropDown from "@/components/ui/CustomDropDown";
import { useState } from "react";
import type {
  Transaction,
  TransactionError,
  TransactionPayload,
} from "../transaction";
import { createTransactionSchema } from "../transaction.schema";
import useTransaction from "../hooks/useTransaction";
import type { ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";
import CustomToast from "@/components/ui/CustomToast";
import toast from "react-hot-toast";

type FormProps = {
  onClose: () => void;
  editedTransaction?: Transaction;
};

const date = new Date();

const TRANSACTION_TYPE_INCOME = [{ text: "Venta", value: "SALE" }];
const TRANSACTION_TYPE_EXPENSE = [
  { text: "Compra", value: "PURCHASE" },
  { text: "Salario", value: "SALARY" },
  { text: "Insumo", value: "SUPPLY" },
];

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export default function Form({ onClose, editedTransaction }: FormProps) {
  const { createTransaction, isCreating, updateTransaction, isUpdating } =
    useTransaction();
  const [serverError, setServerError] = useState<string | null>(null);

  const [transaction, setTransaction] = useState<Partial<TransactionPayload>>({
    type: editedTransaction?.type || "INCOME",
    category: editedTransaction?.category,
    date: editedTransaction?.date
      ? formatDate(editedTransaction.date)
      : `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/01`,
    description: editedTransaction?.description || "",
    amount: editedTransaction?.amount
      ? editedTransaction.amount.toLocaleString("en-US")
      : "",
  });
  const [errors, setErrors] = useState<TransactionError>({});

  const handleDateChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");

    const limited = onlyNumbers.slice(0, 8);

    let formatted = "";
    if (limited.length > 0) {
      formatted = limited.slice(0, 4);
    }
    if (limited.length > 4) {
      formatted += "/" + limited.slice(4, 6);
    }
    if (limited.length > 6) {
      formatted += "/" + limited.slice(6, 8);
    }

    setTransaction({ ...transaction, date: formatted });
  };

  const handleAmountChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");

    const limited = onlyNumbers.slice(0, 12);

    const num = parseInt(limited, 10);

    if (isNaN(num) || limited === "") {
      setTransaction((prev) => ({ ...prev, amount: "" }));
      return;
    }

    const formatted = num.toLocaleString("en-US");

    setTransaction((prev) => ({ ...prev, amount: formatted }));
  };

  const handleChange = (
    name: keyof TransactionPayload,
    value: TransactionPayload[typeof name],
  ) => {
    if (name === "type") {
      setTransaction((prev) => ({
        ...prev,
        type: value as "INCOME" | "EXPENSE",
        category: undefined,
      }));
      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: undefined }));
      }
    } else {
      setTransaction((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof TransactionError]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = () => {
    const result = createTransactionSchema.safeParse(transaction);

    if (!result.success) {
      const fieldErrors: TransactionError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof TransactionError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    if (editedTransaction) {
      updateTransaction(
        { id: editedTransaction.id, data: result.data },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                title="Exito"
                message="La transacción ha sido actualizada exitosamente."
                success={true}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message =
              axiosError.response?.data?.message ??
              "Error al actualizar la transacción";
            setServerError(message);
          },
        },
      );
    } else {
      createTransaction(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              title="Exito"
              message="La transacción ha sido creada exitosamente."
              success={true}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message =
            axiosError.response?.data?.message ??
            "Error al crear la transacción";
          setServerError(message);
        },
      });
    }
  };

  return (
    <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col max-h-[calc(100dvh-2rem)]">
      {/* Begin: Form Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">
          Registrar Nueva Transacción
        </h2>
        <button
          className="hover:text-primary transition-colors cursor-pointer"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      {/* End: Form Header */}

      {/* Begin: Form Body */}
      <form className="p-6 space-y-3 overflow-y-auto flex-1 min-h-0">
        {/* Begin: Server Error */}
        {serverError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">
            {serverError}
          </div>
        )}
        {/* End: Server Error */}

        {/* Begin: Transaction Type */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Tipo de Transacción
          </label>
          <div className="flex gap-4 border p-1 rounded-lg border-gray-200">
            <label
              className={`flex-1 flex items-center justify-center p-2 rounded-lg border border-gray-200 cursor-pointer transition-colors ${transaction.type === "INCOME" ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("type", "INCOME")}
            >
              <span className="text-body-md">Ingreso</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer  transition-colors ${transaction.type === "EXPENSE" ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("type", "EXPENSE")}
            >
              <span className="text-body-md">Gasto</span>
            </label>
          </div>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type}</p>
          )}
        </div>
        {/* End: Transaction Type */}

        {/* Begin: Category */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Categoría de Transacción
          </label>
          <CustomDropDown
            options={
              transaction.type === "INCOME"
                ? TRANSACTION_TYPE_INCOME
                : TRANSACTION_TYPE_EXPENSE
            }
            placeholder="Selecciona la categoria..."
            selectedValue={transaction.category}
            onChange={(value) => handleChange("category", value)}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>
        {/* End: Category */}

        {/* Begin: Date */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Fecha de Transacción
          </label>
          <input
            type="text"
            placeholder={`${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/01`}
            className="pl-4 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm"
            value={transaction.date}
            onChange={(e) => handleDateChange(e.target.value)}
            maxLength={10}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>
        {/* End: Date */}

        {/* Begin: Amount */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">Monto</label>
          <div className="relative">
            <p className="absolute left-4 -translate-y-1/2 top-1/2 text-text-primary">
              ₡
            </p>
            <input
              type="text"
              placeholder="50 000"
              className="pl-8 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm"
              value={transaction.amount ?? ""}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>
        {/* End: Amount */}

        {/* Begin: Description */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Descripción
          </label>

          <textarea
            className="pl-4 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-24 resize-none"
            value={transaction.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
        </div>
        {/* End: Description */}
      </form>
      {/* End: Form Body */}

      {/* Begin: Form Footer */}
      <div className="p-4 bg-gray-50 flex gap-2 justify-end">
        <button
          className="min-w-30 py-2 rounded-lg border border-gray-200 text-text-primary font-semibold hover:bg-gray-100 transition-colors cursor-pointer active:scale-[0.98]"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button
          className="min-w-30 py-2 rounded-lg bg-primary text-white font-semibold active:scale-[0.98] transition-transform hover:bg-primary/90 cursor-pointer"
          onClick={handleSubmit}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{isUpdating ? "Actualizar" : "Guardar"}</span>
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}
