import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Room, BookingForm } from "../../types/room";
import { useAuthStore } from "../../auth/Authentication";
import { toast } from "react-toastify";
import StripeBooking from "./StripeBooking";

interface Props {
  room: Room;
  onClose: () => void;
}

export interface BookingFormData extends BookingForm {
  guests: number;
}

export default function BookingModal({ room, onClose }: Props) {
  const navigate = useNavigate();
  const token = useAuthStore().token;
  const [stripeError, setStripeError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    defaultValues: { checkIn: "", checkOut: "", guests: 1 },
  });

  if (!token) {
    navigate("/login");
    return null;
  }

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff;
  };

  const nights = calculateNights();
  const total = nights > 0 ? nights * room.room_Price : 0;

  // ✅ On confirm → call Stripe → redirect
  const onSubmit = async (data: BookingFormData) => {
    setStripeError(null);
  
    const startDate = new Date(data.checkIn);
    const endDate = new Date(data.checkOut);
    const currentDate = new Date(today);
  
    // Validate dates
    if (startDate < currentDate) {
      setError("checkIn", {
        type: "manual",
        message: "Check-in date cannot be before today",
      });
      return;
    }
  
    if (endDate < currentDate) {
      setError("checkOut", {
        type: "manual",
        message: "Check-out date cannot be before today",
      });
      return;
    }
  
    if (nights < 1) {
      setError("checkOut", {
        type: "manual",
        message: "Check-out must be at least 1 night after check-in",
      });
      return;
    }
  
    clearErrors();
  
    try {
      const response = await StripeBooking({
        data,
        checkIn,
        checkOut,
        room,
        total,
        nights,
        token,
      });
      console.log(response);
      if(response.status===400){
        throw new Error(response.message);
      }
  
      const result = await response.url;
      // console.log(result);
    
      // if (!response.url) {
      //   throw new Error(
      //     result?.message ||
      //     result?.error ||
      //     "Failed to create Stripe session"
      //   );
      // }
  
      if (!result) {
        throw new Error(response.message||"Stripe URL was not returned by the server.");
      }
  
      if (!result.includes("stripe.com")) {
        throw new Error("Invalid Stripe Checkout URL.");
      }
  
      toast.success("Redirecting to Stripe...");
  
      // Redirect to Stripe Checkout
      window.location.href = result ?? "";
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment setup failed";
  
      console.error("Stripe Error:", err);
      setStripeError(message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Book Room #{room.room_Id}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Complete your booking details
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Check-In Date
              </label>
              <input
                type="date"
                min={today}
                className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.checkIn ? "border-red-500" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("checkIn", { required: "Check-in date is required" })}
              />
              {errors.checkIn && (
                <p className="mt-1 text-xs text-red-400">⚠ {errors.checkIn.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Check-Out Date
              </label>
              <input
                type="date"
                min={checkIn || today}
                className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.checkOut ? "border-red-500" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("checkOut", { required: "Check-out date is required" })}
              />
              {errors.checkOut && (
                <p className="mt-1 text-xs text-red-400">⚠ {errors.checkOut.message}</p>
              )}
            </div>
          </div>

          {/* GUESTS */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Number of People Staying
            </label>
            <input
              type="number"
              min={1}
              placeholder="Enter number of guests"
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.guests ? "border-red-500" : "border-slate-600 hover:border-slate-500"
              }`}
              {...register("guests", {
                required: "Number of guests is required",
                min: { value: 1, message: "At least 1 guest is required" },
                max: {
                  value: room.room_Capacity ?? 10,
                  message: `Maximum allowed guests is ${room.room_Capacity ?? 10}`,
                },
              })}
            />
            {errors.guests && (
              <p className="mt-1 text-xs text-red-400">⚠ {errors.guests.message}</p>
            )}
          </div>

          {/* SUMMARY */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Nights</p>
              <p className={`text-lg font-semibold ${nights < 1 ? "text-red-400" : "text-indigo-400"}`}>
                {nights > 0 ? nights : 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">Total Price</p>
              <p className="text-2xl font-bold text-white">Rs {total}</p>
            </div>
          </div>

          {nights < 1 && checkIn && checkOut && (
            <p className="text-xs text-red-400 -mt-3">⚠ Stay duration must be at least 1 night</p>
          )}

          {/* STRIPE ERROR */}
          {stripeError && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              ⚠ {stripeError}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-600 hover:border-slate-500 text-slate-300 rounded-lg text-sm transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                "Confirm & Pay"  // ✅ clearer label
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}