import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

type CustomDropDownProps = {
  selectedValue?: string;
  options?: { text: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export default function CustomDropDown({
  options,
  onChange,
  selectedValue,
  placeholder,
  error,
}: CustomDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options?.find(
    (option) => option.value === selectedValue,
  );

  useClickOutside(menuRef, isOpen, () => setIsOpen(false));

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative" ref={menuRef}>
        <div
          className="w-full h-11 px-md appearance-none bg-surface border border-gray-200 rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none pl-2 flex items-center cursor-pointer text-sm text-text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <span className="flex items-center gap-2 text-sm text-text-primary  text-nowrap overflow-hidden text-ellipsis w-full mr-10">
            {selectedOption
              ? selectedOption.text
              : placeholder || "Selecciona una opción"}
          </span>
          <span
            className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
            data-icon="expand_more"
          >
            expand_more
          </span>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {isOpen && (
          <div
            className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 text-sm overflow-hidden"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {options && options.length > 0 ? (
              options?.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${option.value === selectedValue ? "bg-gray-100" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                  }}
                >
                  {option.text}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500">
                No hay opciones disponibles
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
