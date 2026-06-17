import { useState } from "react";

interface InputPasswordProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
}

export default function InputPassword({
  name,
  value,
  onChange,
  placeholder = "••••••••",
  error,
}: InputPasswordProps) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div className="relative">
        <input
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-all placeholder:text-gray-400 pr-12"
          placeholder={placeholder}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
          type="button"
          onClick={() => setShow(!show)}
        >
          <span className="material-symbols-outlined cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
            {show ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
