import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../auth/Authentication";
import type { ConfirmedPaymentResponse } from "../../types/payment";
import "./paymentSuccess.css";

export interface PaymentSuccessProps {
  amount?: string;
  currency?: string;
  orderId?: string;
  cardLast4?: string;
  date?: string;
  email?: string;
  onContinueShopping?: () => void;
}

export default function PaymentSuccess({
  amount = "0.00",
  currency = "$",
  orderId = "—",
  cardLast4 = "****",
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email = "your email address",
  onContinueShopping,
}: PaymentSuccessProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const token = useAuthStore().token;
  // const isAuthenticated = useAuthStore().isAuthenticated;


  const [loading, setLoading] = useState(true);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [paymentData, setPaymentData] =
    useState<ConfirmedPaymentResponse | null>(null);

  /* ---------------------------------------------------- */
  /* VERIFY PAYMENT */
  /* ---------------------------------------------------- */

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setPaymentError("Missing Stripe session ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5109/api/CreatePayment`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              sessionId:sessionId
            }),
          }
        );
        // console.log(response);/

        if (!response.ok) {
          throw new Error(
            "Failed to verify payment"
          );
        }

        const result =
          (await response.json()) as ConfirmedPaymentResponse;

        // console.log("Payment Success:", result);

        setPaymentData(result);
       }catch (error) {
        console.error(error);

        setPaymentError(
          error instanceof Error
            ? error.message
            : "Payment verification failed"
        );
      } finally {
        setLoading(false);
      }
    }
    verifyPayment();
  }, [sessionId, token]);

  /* ---------------------------------------------------- */
  /* CONFETTI */
  /* ---------------------------------------------------- */

  useEffect(() => {
    const container = confettiRef.current;

    if (!container) return;

    const colors = [
      "#10B981",
      "#34D399",
      "#6EE7B7",
      "#059669",
      "#A7F3D0",
    ];

    const dots: HTMLDivElement[] = [];

    for (let i = 0; i < 40; i++) {
      const dot = document.createElement("div");

      const size = 4 + Math.random() * 6;

      dot.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        border-radius:9999px;
        background:${
          colors[
            Math.floor(
              Math.random() * colors.length
            )
          ]
        };
        left:${Math.random() * 100}%;
        top:${Math.random() * 20}px;
        opacity:0;
        animation:confettiFall ${
          1 + Math.random() * 1
        }s ease-in ${
        Math.random() * 1
      }s forwards;
        pointer-events:none;
      `;

      container.appendChild(dot);

      dots.push(dot);
    }

    return () =>
      dots.forEach((dot) => dot.remove());
  }, []);

  /* ---------------------------------------------------- */
  /* LOADING */
  /* ---------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500 text-sm">
            Verifying payment...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- */
  /* ERROR */
  /* ---------------------------------------------------- */

  if (paymentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg text-center">

          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <ErrorIcon />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Verification Failed
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            {paymentError}
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- */
  /* DETAILS */
  /* ---------------------------------------------------- */

  const rows = [
    {
      label: "Order ID",
      value: `#${
        paymentData?.bookingId ?? orderId
      }`,
    },
    {
      label: "Payment Method",
      value: (
        <span className="flex items-center gap-2">
          <CreditCardIcon />
          {`•••• ${cardLast4}`}
        </span>
      ),
    },
    {
      label: "Date",
      value: date,
    },
    {
      label: "Status",
      value: (
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
          Successful
        </span>
      ),
    },
    {
      label: "Guests",
      value:
        paymentData?.guests ?? "N/A",
    },
    {
      label: "Nights",
      value:
        paymentData?.nights ?? "N/A",
    },
  ];

  /* ---------------------------------------------------- */
  /* UI */
  /* ---------------------------------------------------- */

  return (
    <div className="font-main min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-4 py-10">

      <div className="relative w-full max-w-lg rounded-[32px] glass border border-white/40 shadow-[0_20px_80px_rgba(16,185,129,0.15)] overflow-hidden p-8">

        {/* Glow */}
        <div className="absolute -top-24 -right-20 w-56 h-56 bg-emerald-300/30 blur-3xl rounded-full" />

        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-emerald-200/40 blur-3xl rounded-full" />

        {/* Confetti */}
        <div
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        />

        {/* Icon */}
        <div className="relative z-10 animate-pop w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckIcon />
        </div>

        {/* Heading */}
        <div className="relative z-10 text-center mt-7">
          <h1 className="animate-1 text-3xl font-semibold text-gray-900">
            Payment Successful
          </h1>

          <p className="animate-2 text-gray-500 mt-2 text-sm leading-relaxed">
            Your booking has been confirmed successfully.
          </p>
        </div>

        {/* Amount */}
        <div className="animate-3 relative z-10 mt-8 rounded-3xl bg-white/80 border border-white/50 shadow-sm px-6 py-7 text-center">

          <p className="uppercase tracking-[0.3em] text-[11px] text-gray-400 font-medium">
            Total Paid
          </p>

          <h2 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            {currency}
            {paymentData?.amount ?? amount}
          </h2>
        </div>

        {/* Rows */}
        <div className="animate-4 relative z-10 mt-7 rounded-2xl bg-white/70 border border-white/40 divide-y divide-gray-100 overflow-hidden">

          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4"
            >
              <span className="text-sm text-gray-500">
                {row.label}
              </span>

              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Email */}
        <p className="animate-4 relative z-10 mt-6 text-center text-sm text-gray-500 leading-relaxed">

          Confirmation email sent to

          <span className="font-medium text-gray-700">
            {" "}
            {paymentData?.email ?? email}
          </span>
        </p>

        {/* Button */}
        <button
          onClick={onContinueShopping}
          className="animate-4 relative z-10 mt-8 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------- */
/* ICONS */
/* ---------------------------------------------------- */

function CheckIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="1"
        y="4"
        width="22"
        height="16"
        rx="2"
      />

      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#DC2626"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />

      <line x1="15" y1="9" x2="9" y2="15" />

      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}