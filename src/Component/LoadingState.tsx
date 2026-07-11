import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

// ─── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid #151e2e" }}>
      {[20, 35, 50, 30, 15].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <div
            style={{
              height: 12,
              width: `${w}%`,
              borderRadius: 6,
              background: "rgba(255,255,255,.05)",
              animation: `shimmer 1.4s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: .4; }
          50% { opacity: .9; }
        }
      `}</style>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <tr>
      <td colSpan={5} style={{ padding: "40px 24px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f87171",
            }}
          >
            <AlertCircle size={22} />
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 280 }}>{message}</p>
          <button
            onClick={onRetry}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #2a3450",
              background: "#1a2035",
              color: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Full-page loading spinner ────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        color: "#475569",
        gap: 10,
        fontSize: 14,
      }}
    >
      <Loader2 size={18} style={{ animation: "spin .7s linear infinite" }} />
      Loading contacts…
    </div>
  );
}
