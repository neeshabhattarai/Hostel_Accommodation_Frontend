import React from "react";
import { X } from "lucide-react";

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;
}
export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".03em",
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────
interface IconButtonProps {
  onClick: () => void;
  title: string;
  color: string;
  icon: React.ReactNode;
}
export function IconButton({ onClick, title, color, icon }: IconButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${hovered ? `${color}66` : "#2a3450"}`,
        background: hovered ? `${color}22` : "#1a2035",
        color: hovered ? color : "#94a3b8",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .15s",
      }}
    >
      {icon}
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2d45",
          borderRadius: 20,
          padding: "28px 28px 24px",
          width: "100%",
          maxWidth: 420,
          animation: "fadeIn .2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid #2a3450",
              background: "#1a2035",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
import { CheckCircle, Trash2 } from "lucide-react";
import type { ToastState } from "../types/hostel";

interface ToastProps {
  toast: NonNullable<ToastState>;
}
export function Toast({ toast }: ToastProps) {
  const isDanger = toast.variant === "danger";
  return (
    <div
      style={{
        position: "absolute",
        top: -8,
        right: 0,
        zIndex: 100,
        background: isDanger ? "#1c1010" : "#0d1f14",
        border: `1px solid ${isDanger ? "rgba(239,68,68,.3)" : "rgba(16,185,129,.3)"}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        color: isDanger ? "#f87171" : "#34d399",
        display: "flex",
        alignItems: "center",
        gap: 8,
        animation: "slideDown .2s ease",
      }}
    >
      {isDanger ? <Trash2 size={14} /> : <CheckCircle size={14} />}
      {toast.msg}
    </div>
  );
}
