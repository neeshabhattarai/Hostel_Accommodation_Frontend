import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../auth/Authentication";
import { userApi } from "../../api/profileApi";


interface EditFormData {
    firstName: string;
    lastName: string;
    email: string;
    phonenumber: string;
    address: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">
        {label}
        {hint && <span className="text-slate-500 font-normal ml-1.5 text-xs">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Pull from your auth store — adjust field names to match yours
  const store = useAuthStore().user as any;
  const firstName    = store.firstName    ?? "";
  const lastName    = store.lastName    ?? "";
  const email   = store.email   ?? "";
  const phone   = store.phone   ?? "";
  const address = store.address ?? "";
  const role    = store.role    ?? "Guest";

  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditFormData>({
    defaultValues: {
        firstName,
        lastName,
        email,
        phone,
        address,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: EditFormData) => {
    setSaving(true);
    setServerError("");
    try {
      await userApi.updateUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, phonenumber: data.phone, address: data.address, id: store.id, role: store.role,oldPassword: data.currentPassword, password: data.newPassword});
    //   if (data.newPassword) await userApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      await new Promise((r) => setTimeout(r, 900)); // mock delay
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate("/profile"); }, 1800);
    } catch (err: any) {
      setServerError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl text-sm bg-slate-800 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 ${
      hasError ? "border-red-500/60" : "border-slate-700 hover:border-slate-600"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <p className="text-slate-400 text-sm mt-0.5">Update your personal information</p>
          </div>
        </div>

        {/* ── AVATAR PREVIEW ── */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-white font-semibold">{name || "Your Name"}</p>
            <p className="text-slate-400 text-sm mt-0.5">{role}</p>
          </div>
        </div>

        {/* Success banner */}
        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated! Redirecting…
          </div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <span>⚠</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* ── PERSONAL INFO ── */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h2 className="text-white font-semibold text-sm">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Field label="First Name" error={errors.firstName?.message}>
    <input
      type="text"
      placeholder="First name"
      className={inputCls(!!errors.firstName)}
      {...register("firstName", {
        required: "First name is required",
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "First name must contain letters only",
        },
        minLength: {
          value: 2,
          message: "Minimum 2 characters",
        },
        maxLength: {
          value: 30,
          message: "Maximum 30 characters",
        },
      })}
    />
  </Field>

  <Field label="Last Name" error={errors.lastName?.message}>
    <input
      type="text"
      placeholder="Last name"
      className={inputCls(!!errors.lastName)}
      {...register("lastName", {
        required: "Last name is required",
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "Last name must contain letters only",
        },
        minLength: {
          value: 2,
          message: "Minimum 2 characters",
        },
        maxLength: {
          value: 30,
          message: "Maximum 30 characters",
        },
      })}
    />
  </Field>
</div>

            <Field label="Email address" error={errors.email?.message}>
              <input
                type="email"
                placeholder="you@email.com"
                className={inputCls(!!errors.email)}
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone number" hint="(optional)" error={errors.phone?.message}>
                <input
                  type="tel"
                  placeholder="+977 98-XXXX-XXXX"
                  className={inputCls(!!errors.phone)}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^(97|98)\d{8}$/,
                      message:
                        "Phone number must start with 97 or 98 and be exactly 10 digits",
                    },
                  })}
                />
              </Field>

              <Field label="Address" hint="(optional)" error={errors.address?.message}>
                <input
                  type="text"
                  placeholder="City, Country"
                  className={inputCls(!!errors.address)}
                  {...register("address", {
                    maxLength: { value: 120, message: "Address too long (max 120 chars)" },
                  })}
                />
              </Field>
            </div>
          </div>

          {/* ── CHANGE PASSWORD ── */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Change Password</h2>
                <p className="text-slate-500 text-xs">Leave blank to keep your current password</p>
              </div>
            </div>

            {/* Current password */}
            <Field label="Current password" error={errors.currentPassword?.message}>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="Enter current password"
                  className={inputCls(!!errors.currentPassword) + " pr-11"}
                  {...register("currentPassword", {
                    validate: (v) =>
                      !watch("newPassword") || !!v || "Current password is required to set a new one",
                  })}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowCurrentPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  {showCurrentPw
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }
                </button>
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New password */}
              <Field label="New password" error={errors.newPassword?.message}>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    placeholder="Min 8 characters"
                    className={inputCls(!!errors.newPassword) + " pr-11"}
                    {...register("newPassword", {
                      minLength: { value: 8, message: "Min 8 characters" },
                    })}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowNewPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                    {showNewPw
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                  </button>
                </div>
              </Field>

              {/* Confirm password */}
              <Field label="Confirm new password" error={errors.confirmPassword?.message}>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Repeat new password"
                    className={inputCls(!!errors.confirmPassword) + " pr-11"}
                    {...register("confirmPassword", {
                      validate: (v) =>
                        !newPasswordValue || v === newPasswordValue || "Passwords do not match",
                    })}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirmPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                    {showConfirmPw
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                  </button>
                </div>
              </Field>
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-3 pb-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
