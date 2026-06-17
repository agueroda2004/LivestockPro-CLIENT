import CustomDropDown from "@/components/ui/CustomDropDown";
import type { DashboardPeriod } from "../dashboard";

type PeriodFilterProps = {
  options: { text: string; value: string }[];
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
  customDateFrom: string;
  customDateTo: string;
  onCustomDateFromChange: (value: string) => void;
  onCustomDateToChange: (value: string) => void;
  landOptions: { text: string; value: string }[];
  landValue: string;
  onLandChange: (value: string) => void;
};

function formatInput(value: string): string {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
  let formatted = "";
  if (onlyNumbers.length > 0) formatted = onlyNumbers.slice(0, 4);
  if (onlyNumbers.length > 4) formatted += "/" + onlyNumbers.slice(4, 6);
  if (onlyNumbers.length > 6) formatted += "/" + onlyNumbers.slice(6, 8);
  return formatted;
}

export default function PeriodFilter({
  options,
  value,
  onChange,
  customDateFrom,
  customDateTo,
  onCustomDateFromChange,
  onCustomDateToChange,
  landOptions,
  landValue,
  onLandChange,
}: PeriodFilterProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 p-4 items-center">
      <div>
        <CustomDropDown
          options={options}
          placeholder="Seleccionar período..."
          selectedValue={value}
          onChange={(v) => onChange(v as DashboardPeriod)}
        />
      </div>

      <div>
        <CustomDropDown
          options={landOptions}
          placeholder="Seleccionar finca..."
          selectedValue={landValue}
          onChange={onLandChange}
        />
      </div>

      {value === "CUSTOM" ? (
        <>
          <div className="relative">
            <span className="text-xs text-gray-500 absolute -translate-y-1/2 top-1/2 left-3 bg-white px-1">
              Desde
            </span>
            <input
              type="text"
              placeholder="YYYY/MM/DD"
              className="pl-16 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-11"
              value={customDateFrom}
              onChange={(e) => onCustomDateFromChange(formatInput(e.target.value))}
              maxLength={10}
            />
          </div>
          <div className="relative">
            <span className="text-xs text-gray-500 absolute -translate-y-1/2 top-1/2 left-3 bg-white px-1">
              Hasta
            </span>
            <input
              type="text"
              placeholder="YYYY/MM/DD"
              className="pl-16 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-11"
              value={customDateTo}
              onChange={(e) => onCustomDateToChange(formatInput(e.target.value))}
              maxLength={10}
            />
          </div>
        </>
      ) : (
        <div className="xl:col-span-2 text-xs text-text-primary/60 h-full flex items-center">
          Mostrando datos para el período y finca seleccionados.
        </div>
      )}
    </div>
  );
}
