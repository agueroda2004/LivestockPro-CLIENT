import { useState } from "react";
import type {
  Cattle,
  CattleMovementError,
  CattleMovementPayload,
  CattleMovementType,
} from "../cattle";
import { createCattleMovementSchema } from "../cattle.schema";
import useCattleMovement from "../hooks/useCattleMovement";
import useLand from "@/features/land/hooks/useLand";
import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomToast from "@/components/ui/CustomToast";
import toast from "react-hot-toast";
import type { ApiErrorResponse } from "@/types";
import type { AxiosError } from "axios";

type MovementFormProps = {
  cattle: Cattle;
  onClose: () => void;
};

const TYPE_OPTIONS: { value: CattleMovementType; text: string }[] = [
  { value: "MOVED", text: "Mover a otra finca" },
  { value: "SOLD", text: "Venta" },
  { value: "DIED", text: "Fallecimiento" },
  { value: "TRANSFERRED", text: "Traslado" },
];

const EXIT_MESSAGES: Record<
  Exclude<CattleMovementType, "MOVED">,
  string
> = {
  SOLD: "El animal será marcado como vendido y dejará de aparecer en el listado activo.",
  DIED: "El animal será marcado como fallecido y dejará de aparecer en el listado activo.",
  TRANSFERRED: "El animal será marcado como trasladado y dejará de aparecer en el listado activo.",
};

export default function MovementForm({ cattle, onClose }: MovementFormProps) {
  const { getLandsToDropdown } = useLand();
  const { createMovement, isCreating } = useCattleMovement();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<CattleMovementError>({});

  const [movement, setMovement] = useState<CattleMovementPayload>({
    type: "MOVED",
    fromLandId: cattle.land.id,
    toLandId: "",
    notes: "",
  });

  const handleChange = (
    name: keyof CattleMovementPayload,
    value: CattleMovementPayload[typeof name],
  ) => {
    setMovement((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const result = createCattleMovementSchema.safeParse(movement);

    if (!result.success) {
      const fieldErrors: CattleMovementError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CattleMovementError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    createMovement(
      { cattleId: cattle.id, data: result.data },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              title="Exito"
              message="El movimiento ha sido registrado exitosamente."
              success={true}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message =
            axiosError.response?.data?.message ??
            "Error al registrar el movimiento";
          setServerError(message);
        },
      },
    );
  };

  const isMoved = movement.type === "MOVED";

  return (
    <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col">
      {/* Begin: Form Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">
          Movimiento de {cattle.name}
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

        {/* Begin: Current Land */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Finca actual
          </label>
          <p className="text-sm text-text-primary font-semibold">
            {cattle.land.name}
          </p>
        </div>
        {/* End: Current Land */}

        {/* Begin: Type */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">Tipo</label>
          <CustomDropDown
            options={TYPE_OPTIONS}
            placeholder="Seleccionar tipo..."
            selectedValue={movement.type}
            onChange={(value) =>
              handleChange("type", value as CattleMovementType)
            }
            error={errors.type}
          />
        </div>
        {/* End: Type */}

        {/* Begin: To Land (MOVED only) */}
        {isMoved && (
          <div className="space-y-1">
            <label className="text-xs text-text-primary uppercase">
              Finca de destino
            </label>
            <CustomDropDown
              options={getLandsToDropdown?.data.map((land) => ({
                value: land.id,
                text: land.name,
              }))}
              placeholder="Selecciona la finca de destino"
              selectedValue={movement.toLandId}
              onChange={(value) => handleChange("toLandId", value)}
              error={errors.toLandId}
            />
          </div>
        )}
        {/* End: To Land */}

        {/* Begin: Warning for exit movements */}
        {!isMoved && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-xs">
            {EXIT_MESSAGES[movement.type as Exclude<CattleMovementType, "MOVED">]}
          </div>
        )}
        {/* End: Warning */}

        {/* Begin: Notes */}
        <div className="space-y-1">
          <label className="text-xs text-text-primary uppercase">
            Notas (opcional)
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-20 resize-none"
            placeholder="Comentarios adicionales..."
            value={movement.notes ?? ""}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
          {errors.notes && (
            <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
          )}
        </div>
        {/* End: Notes */}
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
          disabled={isCreating}
        >
          {isCreating ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Registrar</span>
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}
