interface InputTextProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
}

export default function InputText({
  name,
  value,
  onChange,
  placeholder = "",
  error,
}: InputTextProps) {
  return (
    <div>
      <input
        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-all placeholder:text-gray-400"
        placeholder={placeholder}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
