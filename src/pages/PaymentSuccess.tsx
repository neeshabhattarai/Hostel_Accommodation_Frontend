import { useEffect, useRef } from "react";

interface PaymentSuccessProps {
  amount?: string;
  currency?: string;
  orderId?: string;
  cardLast4?: string;
  date?: string;
  email?: string;
  onDownloadReceipt?: () => void;
  onContinueShopping?: () => void;
}

export default function PaymentSuccess({
  amount = "128.00",
  currency = "$",
  orderId = "ORD-7842",
  cardLast4 = "4291",
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email = "your email address",
  onDownloadReceipt,
  onContinueShopping,
}: PaymentSuccessProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = confettiRef.current;
    if (!container) return;

    const colors = ["#1D9E75", "#5DCAA5", "#9FE1CB", "#085041", "#0F6E56", "#B5F0D8"];
    const dots: HTMLDivElement[] = [];

    for (let i = 0; i < 32; i++) {
      const dot = document.createElement("div");
      const size = 4 + Math.random() * 5;
      const delay = Math.random() * 0.8;
      const duration = 0.9 + Math.random() * 0.6;
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 20}px;
        opacity: 0;
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        pointer-events: none;
      `;
      container.appendChild(dot);
      dots.push(dot);
    }

    return () => dots.forEach((d) => d.remove());
  }, []);

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Order number", value: `#${orderId}` },
    {
      label: "Payment method",
      value: (
        <span className="flex items-center gap-1.5">
          <CreditCardIcon />
          {`•••• ${cardLast4}`}
        </span>
      ),
    },
    { label: "Date", value: date },
    {
      label: "Status",
      value: (
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          Paid
        </span>
      ),
    },
  ];

  return (
    <>

      <div className="font-body min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="relative w-full max-w-md bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden px-8 py-10">

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-200" />

          {/* Confetti layer */}
          <div ref={confettiRef} className="absolute top-0 left-0 right-0 h-48 pointer-events-none overflow-hidden" />

          {/* Check icon */}
          <div className="anim-pop w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckIcon />
          </div>

          {/* Heading */}
          <h1 className="anim-s1 font-display text-[26px] font-normal text-gray-900 text-center mb-1">
            Payment successful
          </h1>
          <p className="anim-s2 text-sm font-light text-gray-500 text-center mb-8">
            Your order has been confirmed and is on its way.
          </p>

          {/* Amount block */}
          <div className="anim-s3 bg-gray-50 rounded-xl px-6 py-5 text-center mb-6">
            <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-1">
              Total charged
            </p>
            <p className="font-display text-[42px] leading-none tracking-tight text-gray-900">
              {currency}{amount}
            </p>
          </div>

          {/* Detail rows */}
          <div className="anim-s4">
            {rows.map((row, i) => (
              <div key={i}>
                {i > 0 && <hr className="border-t border-black/[0.06]" />}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[13px] font-light text-gray-500">{row.label}</span>
                  <span className="text-[13px] font-medium text-gray-900 flex items-center gap-1.5">
                    {row.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="anim-s5 flex flex-col gap-2.5 mt-7">
            <button
              onClick={onDownloadReceipt}
              className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-emerald-200 font-medium text-sm py-3.5 rounded-lg transition-all duration-150"
            >
              <DownloadIcon />
              Download receipt
            </button>
            <button
              onClick={onContinueShopping}
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-gray-50 active:scale-[0.98] text-gray-500 font-normal text-sm py-3.5 rounded-lg border border-black/10 transition-all duration-150"
            >
              <ArrowRightIcon />
              Continue shopping
            </button>
          </div>

          {/* Footnote */}
          <p className="anim-s6 text-center text-[12px] font-light text-gray-400 mt-6">
            A confirmation has been sent to {email}.
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
      stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
