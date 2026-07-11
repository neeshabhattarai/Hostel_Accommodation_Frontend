import { Trash2 } from "lucide-react";
import { Modal } from "../../ui/hostelUi";
import type { Hostel } from "../../types/hostel";

interface DeleteModalProps {
  hostel: Hostel;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ hostel, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <Modal title="Delete hostel" onClose={onCancel}>
      <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(239,68,68,.12)",
            border: "1px solid rgba(239,68,68,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#f87171",
          }}
        >
          <Trash2 size={24} />
        </div>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
          Are you sure you want to delete{" "}
          <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{hostel.name}</span>?{" "}
          This action cannot be undone.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "1px solid #2a3450",
            background: "transparent",
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </Modal>
  );
}
