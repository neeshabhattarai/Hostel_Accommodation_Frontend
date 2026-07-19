import React from "react";
import {
  useForm,
  type FieldError,
} from "react-hook-form";
import {
  Save,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { HostelFormValues } from "../../types/hostel";

interface FieldProps {
  id: string;
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

function Field({
  id,
  label,
  error,
  children,
}: FieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <label
        htmlFor={id}
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: ".05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>

      {children}

      {error?.message && (
        <p
          role="alert"
          style={{
            fontSize: 11,
            color: "#f87171",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <AlertCircle size={12} />
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

const inputStyle = (
  hasError: boolean
): React.CSSProperties => ({
  width: "100%",
  background: "#1a2035",
  border: `1px solid ${
    hasError ? "#f87171" : "#2a3450"
  }`,
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
  color: "#e2e8f0",
  outline: "none",
  fontFamily: "inherit",
  boxShadow: hasError
    ? "0 0 0 3px rgba(248,113,113,.1)"
    : "none",
  transition:
    "border-color .18s, box-shadow .18s",
});

interface HostelFormProps {
  defaultValues?: HostelFormValues;
  onSubmit: (
    data: HostelFormValues
  ) => void | Promise<void>;
  onCancel: () => void;
  isEdit: boolean;
}

export function HostelForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit,
}: HostelFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<HostelFormValues>({
    defaultValues:
      defaultValues ?? {
        name: "",
        address: "",
        phoneNumber: "",
      },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Field
        id="name"
        label="Full Name"
        error={errors.name}
      >
        <input
          id="name"
          type="text"
          placeholder="Enter hostel name"
          style={inputStyle(!!errors.name)}
          aria-invalid={!!errors.name}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message:
                "At least 2 characters",
            },
            maxLength: {
              value: 60,
              message:
                "Maximum 60 characters",
            },
            pattern: {
              value:
                /^[A-Za-z\s'-]+$/,
              message:
                "Letters, spaces, hyphens and apostrophes only",
            },
          })}
        />
      </Field>

      <Field
        id="address"
        label="Address"
        error={errors.address}
      >
        <textarea
          id="address"
          placeholder="Kathmandu, Nepal"
          style={{
            ...inputStyle(
              !!errors.address
            ),
            minHeight: 80,
            resize: "none",
          }}
          aria-invalid={
            !!errors.address
          }
          {...register("address", {
            required:
              "Address is required",
            minLength: {
              value: 6,
              message:
                "Please enter a full address",
            },
            maxLength: {
              value: 200,
              message:
                "Maximum 200 characters",
            },
          })}
        />
      </Field>

      <Field
        id="phoneNumber"
        label="Phone Number"
        error={errors.phoneNumber}
      >
        <input
          id="phoneNumber"
          type="tel"
          placeholder="+977 98XXXXXXXX"
          style={inputStyle(
            !!errors.phoneNumber
          )}
          aria-invalid={
            !!errors.phoneNumber
          }
          {...register(
            "phoneNumber",
            {
              required:
                "Phone number is required",
              pattern: {
                value:
                  /^[9]{1}[8,7]{1}[0-9]{8}$/,
                message:
                  "Enter a valid phone number",
              },
            }
          )}
        />
      </Field>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 8,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border:
              "1px solid #2a3450",
            background:
              "transparent",
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: isSubmitting
              ? "not-allowed"
              : "pointer",
            opacity:
              isSubmitting
                ? 0.6
                : 1,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            gap: 6,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Saving...
            </>
          ) : isEdit ? (
            <>
              <Save size={14} />
              Save Changes
            </>
          ) : (
            <>
              <Plus size={14} />
              Add Hostel
            </>
          )}
        </button>
      </div>
    </form>
  );
}