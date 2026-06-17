import { useState } from "react";
import type { Cattle, CattleError, CattlePayload } from "../cattle";
import useLand from "@/features/land/hooks/useLand";
import CustomDropDown from "@/components/ui/CustomDropDown";
import useRace from "@/features/race/hooks/useRace";
import { createCattleSchema } from "../cattle.schema";
import useCattle from "../hooks/useCattle";
import CustomToast from "@/components/ui/CustomToast";
import toast from "react-hot-toast";
import type { ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

type FormProps = {
  onClose: () => void;
  editedCattle?: Cattle | null;
};

export default function Form({ onClose, editedCattle }: FormProps) {
  const { getLandsToDropdown } = useLand();
  const { getRacesToDropdown } = useRace();
  const { createCattle, isCreating, updateCattle, isUpdating } = useCattle();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<CattleError>({});
  const [animal, setAnimal] = useState<CattlePayload>({
    name: editedCattle?.name || "",
    gender: editedCattle?.gender === "FEMALE" ? "FEMALE" : "MALE",
    landId: editedCattle?.land?.id || "",
    raceId: editedCattle?.race?.id || "",
  });

  const handleChange = (
    name: keyof CattlePayload,
    value: CattlePayload[typeof name],
  ) => {
    setAnimal({ ...animal, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = () => {
    const result = createCattleSchema.safeParse(animal);

    if (!result.success) {
      const fieldErrors: CattleError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CattleError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    if (editedCattle) {
      const { landId: _omit, ...updatable } = result.data;
      void _omit;
      updateCattle(
        { id: editedCattle.id, data: updatable },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                title="Exito"
                message="El animal ha sido actualizado exitosamente."
                success={true}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message =
              axiosError.response?.data?.message ??
              "Error al actualizar el animal";
            setServerError(message);
          },
        },
      );
    } else {
      createCattle(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              title="Exito"
              message="El animal ha sido registrado exitosamente."
              success={true}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message =
            axiosError.response?.data?.message ?? "Error al crear el animal";
          setServerError(message);
        },
      });
    }
  };

  return (
    <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col">
      {/* Begin: Form Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">
          {editedCattle ? "Editar Animal" : "Registrar Nuevo Animal"}
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
      <form className="p-6 space-y-3">
        {/* Begin: Server Error */}
        {serverError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">
            {serverError}
          </div>
        )}
        {/* End: Server Error */}

        {/* Begin: Animal ID */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            ID del Animal
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-primary text-sm"
            placeholder="Ej. 1234"
            type="text"
            value={animal.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        {/* End: Animal ID */}

        {/* Begin: Animal Gender */}
        <div>
          <label className="text-xs text-text-primary uppercase">
            Género del Animal
          </label>
          <div className="flex gap-4 border p-1 rounded-lg border-gray-200">
            <label
              className={`flex-1 flex items-center justify-center p-2 rounded-lg border border-gray-200 cursor-pointer transition-colors ${animal.gender === "MALE" ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("gender", "MALE")}
            >
              <span className="text-body-md">Macho</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer  transition-colors ${animal.gender === "FEMALE" ? "bg-primary/20" : "hover:bg-gray-200"}`}
              onClick={() => handleChange("gender", "FEMALE")}
            >
              <span className="text-body-md">Hembra</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>
        {/* End: Animal Gender */}

        {/* Begin: Land (read-only when editing) */}
        {editedCattle ? (
          <div className="space-y-1">
            <label className="text-xs text-text-primary uppercase">Finca</label>
            <p className="text-sm text-text-primary font-semibold">
              {editedCattle.land.name}
            </p>
            <p className="text-[11px] text-text-primary/50">
              Para cambiar de finca, registra un movimiento desde la tarjeta del
              animal.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs text-text-primary uppercase">Finca</label>
            <CustomDropDown
              onChange={(value) => handleChange("landId", value)}
              options={getLandsToDropdown?.data.map((land) => ({
                value: land.id,
                text: land.name,
              }))}
              placeholder="Selecciona una finca"
              selectedValue={animal.landId}
              error={errors.landId}
            />
          </div>
        )}
        {/* End: Land */}

        {/* Begin: Race Dropdown */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">Raza</label>
          <CustomDropDown
            onChange={(value) => handleChange("raceId", value)}
            options={getRacesToDropdown?.data.map((race) => ({
              value: race.id,
              text: race.name,
            }))}
            placeholder="Selecciona una raza"
            selectedValue={animal.raceId}
            error={errors.raceId}
          />
        </div>
        {/* End: Race Dropdown */}
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
