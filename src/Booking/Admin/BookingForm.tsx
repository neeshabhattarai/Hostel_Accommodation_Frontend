import { useState, useEffect } from "react";
import type { Booking, BookingFormData } from "../../types/booking.types";

interface BookingFormProps {
  initial?: Booking | null;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type FormState = {
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  totalPayments: number;
  roomPrice: string;
  noofNights: number;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  bookingDate: new Date().toISOString(),
  checkInDate: "",
  checkOutDate: "",
  roomId: "",
  totalPayments: 0,
  roomPrice: "",
  noofNights: 0,
};

export default function BookingForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Map Booking → FormState safely
  useEffect(() => {
    if (initial) {
      setForm({
        bookingDate: initial.bookingDate,
        checkInDate: initial.checkInDate,
        checkOutDate: initial.checkOutDate,
        roomId: String(initial["room"].room_Id),
        totalPayments: initial.totalPayments,
        roomPrice: String(initial["room"].room_Price),
        noofNights: initial.noofNights,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  // Auto calculation (nights + total)
  useEffect(() => {
    if (!form.checkInDate || !form.checkOutDate) return;

    const start = new Date(form.checkInDate);
    const end = new Date(form.checkOutDate);

    const nights = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86400000)
    );

    const price = parseFloat(form.roomPrice || "0");

    setForm((f) => ({
      ...f,
      noofNights: nights,
      totalPayments: nights * price,
    }));
  }, [form.checkInDate, form.checkOutDate, form.roomPrice]);

  // Generic setter (safe for string fields only)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.checkInDate) e.checkInDate = "Required";
    if (!form.checkOutDate) e.checkOutDate = "Required";
    const today=new Date();
    today.setHours(0,0,0,0);
    const checkIn=new Date(form.checkInDate);
    checkIn.setHours(0,0,0,0);
    const checkOut=new Date(form.checkOutDate);
    checkOut.setHours(0,0,0,0);
    if(checkIn<today){
      e.checkInDate="cannot be past date";
    }
    if(checkOut<today){
      e.checkOutDate="cannot be past date";
    }

    if (
      form.checkInDate &&
      form.checkOutDate &&
      form.checkOutDate <= form.checkInDate
    ) {
      e.checkOutDate = "Must be after check-in";
    }


    if (!form.roomId || Number(form.roomId) <= 0)
      e.roomId = "Must be > 0";

    if (!form.roomPrice || Number(form.roomPrice) <= 0)
      e.roomPrice = "Must be > 0";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const data={
      checkInDate:form.checkInDate,
      checkOutDate:form.checkOutDate,
    }
    await onSubmit(data);

  }
  const inputClass = (key: keyof FormState) =>
    `w-full h-10 px-3 rounded-lg border text-sm text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 ${
      errors[key]
        ? "border-red-400 bg-red-50 focus:border-red-400"
        : "border-gray-200 bg-white focus:border-blue-400"
    }`;

  const readonlyClass =
    "w-full h-10 px-3 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Check-in */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Check-in Date
          </label>
          <input
            type="date"
            value={form.checkInDate}
            onChange={(e) => set("checkInDate", e.target.value)}
            className={inputClass("checkInDate")}
          />
          {errors.checkInDate && (
            <p className="text-xs text-red-500">{errors.checkInDate}</p>
          )}
        </div>

        {/* Check-out */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Check-out Date
          </label>
          <input
            type="date"
            value={form.checkOutDate}
            onChange={(e) => set("checkOutDate", e.target.value)}
            className={inputClass("checkOutDate")}
          />
          {errors.checkOutDate && (
            <p className="text-xs text-red-500">{errors.checkOutDate}</p>
          )}
        </div>

        {/* Room ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Room ID
          </label>
          <input
          readOnly
            type="number"
            min={1}
            value={form.roomId}
            onChange={(e) => set("roomId", e.target.value)}
            className={inputClass("roomId")}
          />
          {errors.roomId && (
            <p className="text-xs text-red-500">{errors.roomId}</p>
          )}
        </div>

        {/* Room Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Room Price / Night
          </label>
          <input
          readOnly
            type="number"
            min={0}
            value={form.roomPrice}
            onChange={(e) => set("roomPrice", e.target.value)}
            className={inputClass("roomPrice")}
          />
          {errors.roomPrice && (
            <p className="text-xs text-red-500">{errors.roomPrice}</p>
          )}
        </div>

        {/* Nights */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Nights (auto)
          </label>
          <input
            type="number"
            value={form.noofNights}
            readOnly
            className={readonlyClass}
          />
        </div>

        {/* Total */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Total Payment (auto)
          </label>
          <input
            type="number"
            value={form.totalPayments}
            readOnly
            className={readonlyClass}
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-9 px-4 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-9 px-5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : initial ? "Save Changes" : "Create Booking"}
        </button>
      </div>
    </form>
  );
}