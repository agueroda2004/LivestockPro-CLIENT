import { useState } from "react";
import { createLandSchema } from "../land.schema";
import type { Land, LandError, LandPayload } from "../land";
import useLand from "../hooks/useLand";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";
import toast from "react-hot-toast";
import CustomToast from "@/components/ui/CustomToast";

type FormProps = {
  onClose: () => void;
  editedLand?: Land;
};

export default function Form({ onClose, editedLand }: FormProps) {
  const { createLand, isCreating, updateLand, isUpdating } = useLand();
  const [land, setLand] = useState<LandPayload>({
    name: editedLand?.name || "",
    ubication: editedLand?.ubication || "",
    isRented: editedLand?.isRented || false,
    active: editedLand?.active,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<LandError>({});

  const handleChange = (
    name: keyof LandPayload,
    value: LandPayload[typeof name],
  ) => {
    setLand({ ...land, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = createLandSchema.safeParse(land);

    if (!result.success) {
      const fieldErrors: LandError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LandError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    if (editedLand) {
      updateLand(
        { id: editedLand.id, data: result.data },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                title="Exito"
                message="La finca ha sido actualizada exitosamente."
                success={true}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message =
              axiosError.response?.data?.message ??
              "Error al actualizar la finca";
            setServerError(message);
          },
        },
      );
    } else {
      createLand(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              title="Exito"
              message="La finca ha sido registrada exitosamente."
              success={true}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message =
            axiosError.response?.data?.message ?? "Error al crear la finca";
          setServerError(message);
        },
      });
    }
  };

  return (
    <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* Begin: Form Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">
          Registrar Nueva Finca
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
      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        {/* Begin: Server Error */}
        {serverError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">
            {serverError}
          </div>
        )}
        {/* End: Server Error */}

        {/* Begin: Land name */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Nombre de la Finca
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-primary text-sm"
            placeholder="Ej. Finca El Horizonte"
            type="text"
            value={land.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        {/* End: Land name */}

        {/* Begin: Property Type */}
        <div>
          <label className="text-xs text-text-primary uppercase">
            Tipo de Propiedad
          </label>
          <div className="flex gap-4 border p-1 rounded-lg border-gray-200">
            <label
              className={`flex-1 flex items-center justify-center p-2 rounded-lg border border-gray-200 cursor-pointer transition-colors ${!land.isRented ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("isRented", false)}
            >
              <span className="text-body-md">Propia</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer  transition-colors ${land.isRented ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("isRented", true)}
            >
              <span className="text-body-md">Alquilada</span>
            </label>
          </div>
          {errors.isRented && (
            <p className="text-red-500 text-xs mt-1">{errors.isRented}</p>
          )}
        </div>
        {/* End: Property Type */}

        {/* Begin: Location */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Ubicación
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-primary"
              style={{ fontSize: "22px" }}
            >
              location_on
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-primary text-sm"
              placeholder="Dirección de la finca"
              type="text"
              value={land.ubication}
              onChange={(e) => handleChange("ubication", e.target.value)}
            />
          </div>
          {errors.ubication && (
            <p className="text-red-500 text-xs mt-1">{errors.ubication}</p>
          )}
        </div>
        {/* End: Location */}

        {/* Begin: Active toggle */}
        {editedLand && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-primary uppercase">
              Activa
            </label>
            <div
              className={`size-5 ${land.active ? "bg-primary" : "bg-gray-300"} rounded-lg cursor-pointer active:scale-95 transition-transform`}
              onClick={() => handleChange("active", !land.active)}
            />
          </div>
        )}
        {/* End: Active toggle */}
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
