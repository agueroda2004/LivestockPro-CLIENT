import type { ReactNode } from "react";

interface ButtonProps {
  isLoading?: boolean
  disabled?: boolean
  type?: "submit" | "button"
  children?: ReactNode
}

export default function Button({
  isLoading = false,
  disabled = false,
  type = "submit",
  children = "Ingresar",
}: ButtonProps) {
  return (
    <button
      className="w-full bg-primary text-white font-bold py-4 rounded-lg flex items-center justify-center active:scale-[0.98] transition-all shadow-md cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      type={type}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="font-headline-sm text-headline-sm">{children}</span>
      )}
    </button>
  );
}
