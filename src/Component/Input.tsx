import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full border rounded-lg px-4 py-2
        ${error ? "border-red-500" : "border-gray-300"}
        ${className}
      `}
      {...props}
    />
  );
}
