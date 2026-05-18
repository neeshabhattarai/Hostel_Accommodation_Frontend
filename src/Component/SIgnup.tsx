import { useForm, type RegisterOptions } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>();

  const password = watch("password");

  const onSubmit = async (data: SignupData) => {
    setServerError("");
    try {
      console.log("Signup data:", data);
      // await registerUser(data);
      // navigate("/login");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

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
  }: InputFieldProps) => (
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
              ? "border-red-500/60 focus:ring-red-500"
              : "border-slate-600 hover:border-slate-500"
          }`}
          {...register(name, rules)}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow?.(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-10">

          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-3xl font-bold !text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-400 text-base mt-2">
              Join HostelEase and start booking today
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-base">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.firstName
                      ? "border-red-500/60"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("firstName", {
                    required: "Required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400">
                    ⚠ {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.lastName
                      ? "border-red-500/60"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("lastName", {
                    required: "Required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-400">
                    ⚠ {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
            />

            {/* Phone (optional) */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">
                Phone{" "}
              </label>
              <input
                type="tel"
                placeholder="9840000000"
                autoComplete="tel"
                className="w-full px-5 py-3.5 bg-slate-800 border border-slate-600 hover:border-slate-500 rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                {...register("phone", {
                    required: "Phone is required",
                    minLength: { value: 10, message: "Phone must be at least 10 characters" },
                    maxLength: { value: 10, message: "Phone must be at most 10 characters" },
                  pattern: {
                    value: /^[9]{1}[7,8]{1}[0-9]{8}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">
                  ⚠ {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              showToggle
              show={showPassword}
              setShow={setShowPassword}
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Must include uppercase, lowercase, and a number",
                },
              }}
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm password"
              name="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              showToggle
              show={showConfirm}
              setShow={setShowConfirm}
              rules={{
                required: "Please confirm your password",
                validate: (val) =>
                  val === password || "Passwords do not match",
              }}
            />

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                {...register("terms", {
                  required: "You must accept the terms to continue",
                })}
              />
              <div>
                <label
                  htmlFor="terms"
                  className="text-base text-slate-400 cursor-pointer leading-snug"
                >
                  I agree to the{" "}
                  <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                    Privacy Policy
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 text-sm text-red-400">
                    ⚠ {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-base transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-base text-slate-500">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;