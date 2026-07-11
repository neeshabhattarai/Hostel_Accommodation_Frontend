import React from "react";
import { Search, Plus, Pencil, Trash2, Users, RefreshCw } from "lucide-react";
import type{ Hostel, ModalState, ApiState } from "../../types/hostel";
import { Badge, IconButton } from "../../ui/hostelUi";
import { TableSkeleton, ErrorState } from "../../Component/LoadingState";

const AVATAR_COLORS = [
  "#6366f1", "#0ea5e9", "#10b981",
  "#f59e0b", "#ec4899", "#8b5cf6",
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function getAvatarColor(id: string): string {
  const num = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[num % AVATAR_COLORS.length];
}

interface HostelTableProps {
  rows: Hostel[];
  totalCount: number;
  search: string;
  apiState: ApiState;
  apiError: string | null;
  onSearchChange: (v: string) => void;
  onOpenModal: (state: ModalState) => void;
  onRefetch: () => void;
}

export function HostelTable({
  rows,
  totalCount,
  search,
  apiState,
  apiError,
  onSearchChange,
  onOpenModal,
  onRefetch,
}: HostelTableProps) {
  const isLoading = apiState === "loading";

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1a2640",
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #1a2640",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>
            Hostels
          </h1>
          <p style={{ fontSize: 12, color: "#475569" }}>
            {isLoading ? "Fetching…" : `${rows.length} of ${totalCount} records`}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: "0 0 220px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#475569",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            placeholder="Search hostels…"
            value={search}
            disabled={isLoading}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              height: 34,
              background: "#1a2035",
              border: "1px solid #2a3450",
              borderRadius: 8,
              paddingLeft: 32,
              paddingRight: 12,
              fontSize: 13,
              color: "#e2e8f0",
              outline: "none",
              fontFamily: "inherit",
              opacity: isLoading ? 0.5 : 1,
            }}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={onRefetch}
          disabled={isLoading}
          title="Refresh"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "1px solid #2a3450",
            background: "#1a2035",
            color: "#64748b",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isLoading ? 0.5 : 1,
            transition: "all .15s",
          }}
        >
          <RefreshCw
            size={14}
            style={{ animation: isLoading ? "spin .9s linear infinite" : "none" }}
          />
        </button>

        {/* Add button */}
        <button
          onClick={() => onOpenModal({ type: "add" })}
          disabled={isLoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <Plus size={15} />
          Add hostel
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            minWidth: 560,
          }}
        >
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#0f1623" }}>
              {["ID", "Name", "Address", "Phone", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#475569",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #1a2640",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Loading skeleton */}
          {isLoading && <TableSkeleton />}

          {/* Error state */}
          {!isLoading && apiError && (
            <tbody>
              <ErrorState message={apiError} onRetry={onRefetch} />
            </tbody>
          )}

          {/* Empty state */}
          {!isLoading && !apiError && rows.length === 0 && (
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 40, textAlign: "center", color: "#334155", fontSize: 13 }}
                >
                  <Users size={28} style={{ display: "block", margin: "0 auto 8px" }} />
                  {search ? "No hostels match your search" : "No hostels yet — add one!"}
                </td>
              </tr>
            </tbody>
          )}

          {/* Data rows */}
          {!isLoading && !apiError && rows.length > 0 && (
            <tbody>
              {rows.map((row, i) => (
                <TableRow
                  key={row.hostelId}
                  row={row}
                  index={i}
                  onEdit={() => onOpenModal({ type: "edit", row })}
                  onDelete={() => onOpenModal({ type: "delete", row })}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #1a2640",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "#334155" }}>
          Total: {isLoading ? "…" : totalCount} hostels
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ fontSize: 11, color: "#475569" }}>
            {isLoading ? "Loading…" : `${rows.length} shown`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Internal row ──────────────────────────────────────────────────────────────
interface TableRowProps {
  row: Hostel;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function TableRow({ row, index, onEdit, onDelete }: TableRowProps) {
  const [hovered, setHovered] = React.useState(false);
  const color = getAvatarColor(row.hostelId)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #151e2e",
        background: hovered
          ? "rgba(99,102,241,.05)"
          : index % 2 === 0
          ? "transparent"
          : "rgba(255,255,255,.01)",
        transition: "background .15s",
      }}
    >
      <td style={{ padding: "12px 16px" }}>
        <Badge label={row.hostelId} color="#6366f1" />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              flexShrink: 0,
              background: `${color}22`,
              border: `1px solid ${color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color,
              letterSpacing: ".02em",
            }}
          >
            {getInitials(row.name)}
          </div>
          <span
            style={{
              fontSize: 13,
              color: "#e2e8f0",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.name}
          </span>
        </div>
      </td>
      <td
        style={{
          padding: "12px 16px",
          fontSize: 12,
          color: "#64748b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.address}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>
        {row.phoneNumber}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <IconButton onClick={onEdit} title="Edit" color="#6366f1" icon={<Pencil size={13} />} />
          <IconButton onClick={onDelete} title="Delete" color="#ef4444" icon={<Trash2 size={13} />} />
        </div>
      </td>
    </tr>
  );
}
