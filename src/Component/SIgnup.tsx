import { FormProvider, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputField from "../ui/InputField";
import type { SignupData } from "../types/signup.types";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const methods = useForm<SignupData>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const password = watch("password");

  const onSubmit = async (data: SignupData) => {
    setServerError("");
    try {
      const res = await fetch("http://localhost:5109/api/CreateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: data.email,
          Password: data.password,
          PhoneNumber: data.phone,
          FirstName: data.firstName,
          LastName: data.lastName,
          Gender: data.gender,
          Address: data.address,
          Role: data.role,     
        })
      });

      if (res.ok) {
        navigate("/login");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-10">

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

          {serverError && (
            <div className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-base">
              {serverError}
            </div>
          )}

          <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Ram"
                  autoComplete="given-name"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.firstName ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("firstName", {
                    required: "Required",
                    minLength: { value: 2, message: "Too short" },
                    pattern:{value:/^[A-Za-z]+(?: [A-Za-z]+)*$/,message:"Only letters, spaces, and hyphens are allowed"}
                  })}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="sharma"
                  autoComplete="family-name"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.lastName ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("lastName", {
                    required: "Required",
                    minLength: { value: 2, message: "Too short" },
                    pattern:{value:/^[A-Za-z]+(?:[- '][A-Za-z]+)*$/,message:"Only letters, spaces, and hyphens are allowed"
}
                  })}
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.lastName.message}</p>
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
            <div>
            <label className="block text-base font-medium text-slate-300 mb-2">Role</label>
            <select
              className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.role ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
              }`}
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select role</option>
              <option value="helper">Helper</option>
              <option value="manager">Manager</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-red-400">⚠ {errors.role.message}</p>
            )}
          </div>
            {/* Phone */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="9840000000"
                autoComplete="tel"
                className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.phone ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("phone", {
                  required: "Phone is required",
                  minLength: { value: 10, message: "Phone must be at least 10 digits" },
                  maxLength: { value: 10, message: "Phone must be at most 10 digits" },
                  pattern: {
                    value: /^[9][7,8][0-9]{8}$/,
                    message: "Enter a valid Nepali phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">⚠ {errors.phone.message}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">Gender</label>
              <select
                className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.gender ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("gender", { required: "Gender is required" })}
              >
                <option value="" className="text-slate-500">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-400">⚠ {errors.gender.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">Address</label>
              <textarea
                rows={3}
                placeholder="Kathmandu, Nepal"
                className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                  errors.address ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 5, message: "Address is too short" },
                })}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-400">⚠ {errors.address.message}</p>
              )}
            </div>

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              placeholder="••••••••"
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
                validate: (val) => val === password || "Passwords do not match",
              }}
            />

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                {...register("terms", { required: "You must accept the terms to continue" })}
              />
              <div>
                <label htmlFor="terms" className="text-base text-slate-400 cursor-pointer leading-snug">
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
                  <p className="mt-1.5 text-sm text-red-400">⚠ {errors.terms.message}</p>
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
          </FormProvider>

          <p className="mt-8 text-center text-base text-slate-500">
            Already have an account?{" "}
            <NavLink to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;