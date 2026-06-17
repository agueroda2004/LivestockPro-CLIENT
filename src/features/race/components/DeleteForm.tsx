import { useState } from "react";
import useRace from "../hooks/useRace";
import { toast } from "react-hot-toast";
import CustomToast from "@/components/ui/CustomToast";
import type { ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

type DeleteFormProps = {
  raceName: string;
  id: string;
  onClose: () => void;
};

export default function DeleteForm({ raceName, id, onClose }: DeleteFormProps) {
  const { deleteRace, isDeleting } = useRace();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleDelete = () => {
    deleteRace(id, {
      onSuccess: () => {
        toast.custom((t) => (
          <CustomToast
            t={t}
            title="Exito"
            message="La raza ha sido eliminada exitosamente."
            success={true}
          />
        ));
        onClose();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message =
          axiosError.response?.data?.message ?? "Error al eliminar la raza";
        setServerError(message);
      },
    });
  };
  return (
    <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* Begin: Form header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-red-500"
            style={{ fontSize: "22px" }}
          >
            warning
          </span>
          <h2 className="font-headline-sm text-headline-sm text-red-500">
            Eliminar Raza
          </h2>
        </div>
        <button
          className="text-text-primary hover:text-primary transition-colors cursor-pointer"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      {/* End: Form header */}

      {/* Begin: Form body */}
      <div className="p-6 space-y-6">
        {/* Begin: Server Error */}
        {serverError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">
            {serverError}
          </div>
        )}
        {/* End: Server Error */}

        <p className="text-sm text-text-primary">
          ¿Estás seguro de que deseas eliminar la raza{" "}
          <span className="font-bold text-primary">{raceName}</span>? Esta
          acción no se puede deshacer.
        </p>
      </div>
      {/* End: Form body */}

      {/* Begin: Form footer */}
      <div className="p-4 bg-gray-50 flex gap-3 justify-end">
        <button
          className="min-w-30 py-2 rounded-lg border border-gray-200 text-text-primary font-semibold hover:bg-gray-100 transition-all cursor-pointer active:scale-[0.98]"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="min-w-30 py-2 rounded-lg bg-red-500 text-white font-semibold active:scale-[0.98] transition-all hover:bg-red-600 cursor-pointer"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Eliminar</span>
          )}
        </button>
      </div>
      {/* End: Form footer */}
    </div>
  );
}
