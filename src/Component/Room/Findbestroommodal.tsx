import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Room } from "../../types/room";
import { FindBestRoomApi } from "../../api/RoomApi";
import { hostelApi } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";

interface FindBestRoomForm {
  HostelId: string;
  CheckInDate: string;
  CheckOutDate: string;
  PreferredRoomType: string;
  MaximumBudget: number;
  NumberOfGuests: number;
}

interface Props {
  onClose: () => void;
  onResults: (rooms: Room[]) => void;
}

const ROOM_TYPES = ["Single", "Double", "Triple"];

// ── tiny reusable field wrapper ──────────────────────────────────────────────
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
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1", letterSpacing: "0.02em" }}>
        {label}
        {hint && (
          <span style={{ fontWeight: 400, color: "#64748b", marginLeft: "6px" }}>{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "12px", color: "#f87171", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px 14px",
  background: "#0f172a",
  border: `1px solid ${hasError ? "rgba(239,68,68,0.6)" : "rgba(100,116,139,0.4)"}`,
  borderRadius: "8px",
  color: "#f1f5f9",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box" as const,
});

export default function FindBestRoomModal({ onClose, onResults }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  useEffect(() => {
    const loadHostels = async () => {
      try {
        const res = await hostelApi.getAll();
  console.log(res);
        setHostels(res as Hostel[]);
      } catch (err) {
        console.error(err);
      }
    };
  
    loadHostels();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindBestRoomForm>();

  const checkInValue = watch("CheckInDate");

  const onSubmit = async (data: FindBestRoomForm) => {
    setLoading(true);
    setServerError("");

    try {
      const payload = {
        hostelId: data.HostelId,
        checkInDate: data.CheckInDate,
        checkOutDate: data.CheckOutDate,
        preferredRoomType: data.PreferredRoomType || null,
        maximumBudget: Number(data.MaximumBudget),
        numberOfGuests: Number(data.NumberOfGuests),
      };

      const res = await FindBestRoomApi(payload);

      if (!(res.status==200)) throw new Error(`Server error: ${res.status}`);

      const rooms: Room[] = await res.data;
      console.log(rooms);
      onResults(rooms);
      onClose();
    } catch (err: any) {
      setServerError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Today's date string for min date constraint
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    // Overlay
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      {/* Modal panel */}
      <div
        style={{
          background: "#1e293b",
          border: "1px solid rgba(100,116,139,0.35)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(100,116,139,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            {/* Sparkle icon */}
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#f1f5f9" }}>
              Find Your Best Room
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
              Tell us your needs — we'll match the right rooms for you
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(100,116,139,0.15)",
              border: "none",
              color: "#94a3b8",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: "18px" }}
          noValidate
        >
          {serverError && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                color: "#f87171",
                fontSize: "13px",
              }}
            >
              {serverError}
            </div>
          )}

          {/* Hostel ID */}
          <Field label="Hostel" error={errors.HostelId?.message}>
  <select
    style={{
      ...inputStyle(!!errors.HostelId),
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "16px",
      paddingRight: "36px",
    }}
    {...register("HostelId", {
      required: "Please select a hostel",
    })}
  >
    <option value="">Select Hostel</option>

    {hostels.map((hostel) => (
      <option key={hostel.hostelId} value={hostel.hostelId}>
        {hostel.name} - {hostel.address}
      </option>
    ))}
  </select>
</Field>

          {/* Check-in / Check-out */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Check-in" error={errors.CheckInDate?.message}>
              <input
                type="date"
                min={todayStr}
                style={inputStyle(!!errors.CheckInDate)}
                {...register("CheckInDate", { required: "Check-in date is required" })}
              />
            </Field>
            <Field label="Check-out" error={errors.CheckOutDate?.message}>
              <input
                type="date"
                min={checkInValue || todayStr}
                style={inputStyle(!!errors.CheckOutDate)}
                {...register("CheckOutDate", {
                  required: "Check-out date is required",
                  validate: (v) =>
                    !checkInValue || v > checkInValue || "Must be after check-in",
                })}
              />
            </Field>
          </div>

          {/* Guests / Budget */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Number of guests" error={errors.NumberOfGuests?.message}>
              <input
                type="number"
                min={1}
                max={20}
                placeholder="e.g. 2"
                style={inputStyle(!!errors.NumberOfGuests)}
                {...register("NumberOfGuests", {
                  required: "Required",
                  min: { value: 1, message: "At least 1 guest" },
                  max: { value: 20, message: "Max 20 guests" },
                  valueAsNumber: true,
                })}
              />
            </Field>
            <Field label="Max budget" hint="(Rs / night)" error={errors.MaximumBudget?.message}>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#64748b", fontSize: "13px", fontWeight: 500, userSelect: "none",
                }}>
                  Rs.
                </span>
                <input
                  type="number"
                  min={1}
                  placeholder="0"
                  style={{ ...inputStyle(!!errors.MaximumBudget), paddingLeft: "38px" }}
                  {...register("MaximumBudget", {
                    required: "Required",
                    min: { value: 1, message: "Must be > 0" },
                    valueAsNumber: true,
                  })}
                />
              </div>
            </Field>
          </div>

          {/* Room Type — optional */}
          <Field label="Preferred room type" hint="(optional)">
            <select
              style={{
                ...inputStyle(false),
                appearance: "none" as const,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
                paddingRight: "36px",
              }}
              {...register("PreferredRoomType")}
            >
              <option value="">Any type</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(100,116,139,0.2)", margin: "2px 0" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(100,116,139,0.12)",
                border: "1px solid rgba(100,116,139,0.25)",
                borderRadius: "10px",
                color: "#94a3b8",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: "12px",
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px", height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      flexShrink: 0,
                    }}
                  />
                  Searching...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Find Best Rooms
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
