

import { useNavigate, useSearchParams } from "react-router-dom"; // swap for next/navigation if using Next.js
import PaymentSuccess from "./PaymentSuccess";
import { useStripePayment } from "./useStripePayment";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, loading, error } = useStripePayment(sessionId);
  const navigate=useNavigate();
  const handleAfterPayment=()=>{
    return navigate("/room")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <SpinnerIcon />
          <p className="text-sm font-light">Loading payment details…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {error ?? "No payment information found."}
          </p>
          <a href="/" className="text-sm text-emerald-700 underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <PaymentSuccess
      amount={data.amount}
      currency={data.currency}
      orderId={data.orderId}
      cardLast4={data.cardLast4}
      date={data.date}
      email={data.email}
      onContinueShopping={handleAfterPayment}
    />
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
