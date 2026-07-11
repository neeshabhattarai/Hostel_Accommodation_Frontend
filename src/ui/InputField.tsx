import { useFormContext, type RegisterOptions } from "react-hook-form";
import type { SignupData } from "../types/signup.types";

interface InputFieldProps {
  label: string;
  name: keyof SignupData;
  type?: string;
  placeholder: string;
  rules?: RegisterOptions<SignupData>;
  autoComplete?: string;
  showToggle?: boolean;
  show?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  rules,
  autoComplete,
  showToggle,
  show,
  setShow,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupData>();

  return (
    <div>
      <label className="block text-base font-medium text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-5 py-3.5 ${showToggle ? "pr-16" : ""} bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors[name]
              ? "border-red-500/60"
              : "border-slate-600 hover:border-slate-500"
          }`}
          {...register(name, rules)}
        />
        {showToggle && setShow && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {errors[name] && (
        <p className="mt-2 text-sm text-red-400">
          ⚠ {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default InputField;
