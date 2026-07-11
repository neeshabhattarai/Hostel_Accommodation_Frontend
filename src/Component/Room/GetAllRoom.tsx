import { useLoaderData } from "react-router-dom";
import { useState } from "react";
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

export default function GetAllRoomUI() {
  const res = useLoaderData() as LoaderData;
  console.log(res);
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
  {bestRooms
    ? bestRooms.map((item) => (
        <RoomCard
          key={item.room.room_Id}
          room={item.room}
          bookings={bookings}
          onViewDetails={setDetailRoom}
          matchPercentage={item.matchPercentage}
        />
      ))
    : filteredRooms.map((room) => (
        <RoomCard
          key={room.room_Id}
          room={room}
          bookings={bookings}
          onViewDetails={setDetailRoom}
        />
      ))}
</div>

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
