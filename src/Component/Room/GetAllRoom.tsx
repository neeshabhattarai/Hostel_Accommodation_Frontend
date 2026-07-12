import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Room } from "../../types/room";
import { getRoomStatus } from "../../utils/roomHelpers";
import { useRoomFilter } from "../../hooks/useRoomFilter";
import RoomCard from "./RoomCard";
import BookingModal from "./BookingModal";
import RoomDetailDrawer from "./RoomDetailDrawer";
import FindBestRoomModal from "./Findbestroommodal";
import "../styles/room.css";
interface RoomRecommendation {
  room: Room;
  matchPercentage: number;
}

export interface Booking {
  booking_Id: number;
  room_Id: string;
  check_In_Date: string;
  check_Out_Date: string;
}

interface LoaderData {
  rooms: Room[];
  bookings: Booking[];
}

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

// How many numbered page buttons to show around the current page
const PAGE_WINDOW = 2;

export default function GetAllRoomUI() {
  const res = useLoaderData() as LoaderData;
  const rooms = res;
  const bookings = res.bookings;

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Available" | "Booked" | "Occupied" | "Maintenance"
  >("All");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "id">("id");

  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  // ── Find Best Room state ──────────────────────────────────────────────────
  const [showFindModal, setShowFindModal] = useState(false);
  const [bestRooms, setBestRooms] =
  useState<RoomRecommendation[] | null>(null); // null = not searched yet

  // ── Pagination state (synced into the URL as ?pageIndex=&pageSize=) ────────
  // pageIndex is 1-based (matches typical API query params: pageIndex=1&pageSize=12)
  const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[1]; // 12
  const DEFAULT_PAGE_INDEX = 1;

  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get("pageIndex") ?? DEFAULT_PAGE_INDEX);
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

  const setPageIndex = (index: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("pageIndex", String(index));
      return next;
    });
  };

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("pageSize", String(size));
      next.set("pageIndex", String(DEFAULT_PAGE_INDEX)); // reset to first page when page size changes
      return next;
    });
  };

  const handleBestResults = (results: RoomRecommendation[]) => {
    setBestRooms(results);
    // Reset other filters so results are shown cleanly
    setSearch("");
    setFilterStatus("All");
    setSortBy("id");
  };

  const clearBestRooms = () => setBestRooms(null);

  // Use best-room results when available, otherwise use normal filtered list
  const filteredRooms = useRoomFilter({ rooms, search, filterStatus, sortBy });
  const displayRooms = bestRooms ?? filteredRooms;

  // Reset to first page whenever the underlying result set changes
  // (pageSize is intentionally excluded — setPageSize already resets pageIndex itself)
  useEffect(() => {
    setPageIndex(DEFAULT_PAGE_INDEX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus, sortBy, bestRooms]);

  const totalItems = displayRooms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(Math.max(pageIndex, 1), totalPages);
  const startIndex = (safePageIndex - 1) * pageSize;
  const paginatedRooms = displayRooms.slice(startIndex, startIndex + pageSize);

  const goToPageIndex = (index: number) => {
    setPageIndex(Math.min(Math.max(1, index), totalPages));
  };

  // ── Page numbers to render, e.g. [1, 2, 3, '...', 10] ───────────────────────
  const getPageNumbers = (): (number | "...")[] => {
    const current = safePageIndex; // already 1-based
    const pages: (number | "...")[] = [];

    const start = Math.max(1, current - PAGE_WINDOW);
    const end = Math.min(totalPages, current + PAGE_WINDOW);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let p = start; p <= end; p++) pages.push(p);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const counts = {
    All:         rooms.filter(() => true).length,
    Available:   rooms.filter((r) => getRoomStatus(r) === "Available").length,
    Booked:      rooms.filter((r) => getRoomStatus(r) === "Booked").length,
    Occupied:    rooms.filter((r) => getRoomStatus(r) === "Occupied").length,
    Maintenance: rooms.filter((r) => getRoomStatus(r) === "Maintenance").length,
  };

  return (
    <div className="page">

      {/* ── CONTROLS ROW ── */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search rooms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!!bestRooms}
          style={bestRooms ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value as "All" | "Available" | "Booked" | "Occupied" | "Maintenance"
            )
          }
          disabled={!!bestRooms}
          style={bestRooms ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
        >
          <option value="All">All ({counts.All})</option>
          <option value="Available">Available ({counts.Available})</option>
          <option value="Booked">Booked ({counts.Booked})</option>
          <option value="Occupied">Occupied ({counts.Occupied})</option>
          <option value="Maintenance">Maintenance ({counts.Maintenance})</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "id")}
          disabled={!!bestRooms}
          style={bestRooms ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
        >
          <option value="id">Room ID</option>
          <option value="price-asc">Low → High</option>
          <option value="price-desc">High → Low</option>
        </select>

        {/* ── Find Best Room button ── */}
        <button
          onClick={() => setShowFindModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseOut={(e)  => (e.currentTarget.style.opacity = "1")}
        >
          {/* sparkle */}
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Find Best Room
        </button>
      </div>

      {/* ── BEST ROOMS RESULT BANNER ── */}
      {bestRooms && (
        <div
          style={{
            margin: "0 0 20px",
            padding: "14px 20px",
            background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px", height: "32px",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#c4b5fd", fontSize: "14px" }}>
                Best match results
              </p>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
                {bestRooms.length} room{bestRooms.length !== 1 ? "s" : ""} matched your criteria
              </p>
            </div>
          </div>

          <button
            onClick={clearBestRooms}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 14px",
              background: "rgba(100,116,139,0.15)",
              border: "1px solid rgba(100,116,139,0.3)",
              borderRadius: "8px",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(100,116,139,0.25)")}
            onMouseOut={(e)  => (e.currentTarget.style.background = "rgba(100,116,139,0.15)")}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear results
          </button>
        </div>
      )}

      {/* ── EMPTY STATE (best rooms returned nothing) ── */}
      {bestRooms && bestRooms.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#64748b",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
          <p style={{ fontWeight: 700, fontSize: "18px", color: "#94a3b8", margin: "0 0 6px" }}>
            No rooms matched your criteria
          </p>
          <p style={{ fontSize: "14px", margin: "0 0 20px" }}>
            Try adjusting your budget, dates, or guest count.
          </p>
          <button
            onClick={clearBestRooms}
            style={{
              padding: "10px 20px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "10px",
              color: "#a5b4fc",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Show all rooms
          </button>
        </div>
      )}

<div className="room-grid">
  {paginatedRooms.map((item) =>
    bestRooms ? (
      <RoomCard
        key={(item as RoomRecommendation).room.room_Id}
        room={(item as RoomRecommendation).room}
        bookings={bookings}
        onViewDetails={setDetailRoom}
        matchPercentage={(item as RoomRecommendation).matchPercentage}
      />
    ) : (
      <RoomCard
        key={(item as Room).room_Id}
        room={item as Room}
        bookings={bookings}
        onViewDetails={setDetailRoom}
      />
    )
  )}
</div>

      {/* ── PAGINATION ── */}
      {totalItems > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "28px 0 8px",
            padding: "14px 18px",
            background: "rgba(100,116,139,0.08)",
            border: "1px solid rgba(100,116,139,0.2)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            {/* Page size selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8" }}>Rooms per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(100,116,139,0.3)",
                  background: "rgba(15,23,42,0.4)",
                  color: "#e2e8f0",
                  fontSize: "13px",
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Page info */}
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              Showing {totalItems === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems}
            </p>

            {/* Page controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => goToPageIndex(1)}
                disabled={safePageIndex === 1}
                style={paginationButtonStyle(safePageIndex === 1)}
              >
                «
              </button>
              <button
                onClick={() => goToPageIndex(safePageIndex - 1)}
                disabled={safePageIndex === 1}
                style={paginationButtonStyle(safePageIndex === 1)}
              >
                ‹ Prev
              </button>

              {/* Numbered page buttons */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    style={{ padding: "0 4px", color: "#64748b", fontSize: "13px" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPageIndex(p)}
                    style={pageNumberButtonStyle(p === safePageIndex)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPageIndex(safePageIndex + 1)}
                disabled={safePageIndex === totalPages}
                style={paginationButtonStyle(safePageIndex === totalPages)}
              >
                Next ›
              </button>
              <button
                onClick={() => goToPageIndex(totalPages)}
                disabled={safePageIndex === totalPages}
                style={paginationButtonStyle(safePageIndex === totalPages)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {bookingRoom && (
        <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} />
      )}

      {detailRoom && (
        <RoomDetailDrawer
          room={detailRoom}
          onClose={() => setDetailRoom(null)}
          onBook={(room) => {
            setDetailRoom(null);
            setBookingRoom(room);
          }}
        />
      )}

      {showFindModal && (
        <FindBestRoomModal
          onClose={() => setShowFindModal(false)}
          onResults={handleBestResults}
        />
      )}
    </div>
  );
}

function paginationButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(100,116,139,0.3)",
    background: disabled ? "rgba(100,116,139,0.08)" : "rgba(99,102,241,0.15)",
    color: disabled ? "#475569" : "#a5b4fc",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  };
}

function pageNumberButtonStyle(active: boolean): React.CSSProperties {
  return {
    minWidth: "30px",
    padding: "6px 8px",
    borderRadius: "8px",
    border: active
      ? "1px solid rgba(99,102,241,0.6)"
      : "1px solid rgba(100,116,139,0.3)",
    background: active ? "#6366f1" : "rgba(99,102,241,0.1)",
    color: active ? "#fff" : "#a5b4fc",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.2s",
  };
}
