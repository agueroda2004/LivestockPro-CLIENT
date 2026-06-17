import React, { useState } from "react";
import type { Race, RaceError, RacePayload } from "../race";
import { createRaceSchema } from "../race.schema";
import useRace from "../hooks/useRace";
import { toast } from "react-hot-toast";
import CustomToast from "@/components/ui/CustomToast";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";

type FormProps = {
  onClose: () => void;
  editedRace?: Race;
};

export default function Form({ onClose, editedRace }: FormProps) {
  const { createRace, isCreating, updateRace, isUpdating } = useRace();
  const [race, setRace] = useState<RacePayload>({
    name: editedRace?.name || "",
    active: editedRace?.active,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<RaceError>({});

  const handleChange = (
    name: keyof RacePayload,
    value: RacePayload[typeof name],
  ) => {
    setRace({ ...race, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = createRaceSchema.safeParse(race);

    if (!result.success) {
      const fieldErrors: RaceError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RaceError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    if (editedRace) {
      updateRace(
        { id: editedRace.id, data: result.data },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                title="Exito"
                message="La raza ha sido actualizada exitosamente."
                success={true}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message =
              axiosError.response?.data?.message ??
              "Error al actualizar la raza";
            setServerError(message);
          },
        },
      );
    } else {
      createRace(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              title="Exito"
              message="La raza ha sido registrada exitosamente."
              success={true}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message =
            axiosError.response?.data?.message ?? "Error al crear la raza";
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
          Registrar Nueva Raza
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

        {/* Begin: Race name */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Nombre de la Raza
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-primary text-sm"
            placeholder="Ej. Holstein"
            type="text"
            value={race.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        {/* End: Race name */}

        {/* Begin: Active toggle */}
        {editedRace && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-primary uppercase">
              Activa
            </label>
            <div
              className={`size-5 ${race.active ? "bg-primary" : "bg-gray-300"} rounded-lg cursor-pointer active:scale-95 transition-transform`}
              onClick={() => handleChange("active", !race.active)}
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
