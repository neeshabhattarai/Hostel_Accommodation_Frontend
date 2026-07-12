import { useState, useCallback } from "react";
import { MainUrl } from "../../api/BaseUrl";
import type { Room } from "../../types/room";
import { formatDate, getRoomStatus } from "../../utils/roomHelpers";

interface Props {
  room: Room;
  onClose: () => void;
  onBook: (room: Room) => void;
}

// Maps C# enum string → human-readable label
const FLOOR_LABELS: Record<string, string> = {
  GroundFloor: "Ground Floor",
  FirstFloor:  "First Floor",
  SecondFloor: "Second Floor",
  ThirdFloor:  "Third Floor",
  FourthFloor: "Fourth Floor",
};

export default function RoomDetailDrawer({ room, onClose, onBook }: Props) {
  const status = getRoomStatus(room);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalise images — support single string OR array
  const images: string[] = Array.isArray(room.room_Image)
    ? room.room_Image
    : room.room_Image && room.room_Image !== "string"
    ? [room.room_Image]
    : [];

  const hasMultiple = images.length > 1;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    },
    [images.length]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((i) => (i + 1) % images.length);
    },
    [images.length]
  );

  console.log(room);

  // Safe bookings array
  const bookings = room.bookings ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBooking = bookings.find((b: any) => {
    const checkInRaw  = b.check_In_Date  || b.checkIn  || b.checkInDate;
    const checkOutRaw = b.check_Out_Date || b.checkOut || b.checkOutDate;
    if (!checkInRaw || !checkOutRaw) return false;
    const checkIn  = new Date(checkInRaw);
    const checkOut = new Date(checkOutRaw);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return false;
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    return today >= checkIn && today < checkOut;
  });

  const isBookedToday = Boolean(activeBooking);

  const bookedTill = activeBooking
    ? new Date(
        activeBooking.check_Out_Date || activeBooking.checkOut || activeBooking.checkOutDate
      ).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  // ── NEW: Next upcoming booking (room is free today, but booked later) ──────
  const upcomingBooking = bookings
    .filter((b: any) => {
      const checkInRaw = b.check_In_Date || b.checkIn || b.checkInDate;
      if (!checkInRaw) return false;
      const checkIn = new Date(checkInRaw);
      if (isNaN(checkIn.getTime())) return false;
      checkIn.setHours(0, 0, 0, 0);
      return checkIn > today;
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.check_In_Date || a.checkIn || a.checkInDate).getTime();
      const dateB = new Date(b.check_In_Date || b.checkIn || b.checkInDate).getTime();
      return dateA - dateB;
    })[0];

  const upcomingCheckIn = upcomingBooking
    ? formatDate(upcomingBooking.check_In_Date || upcomingBooking.checkIn || upcomingBooking.checkInDate)
    : null;

  // ── Derived values for new fields ──────────────────────────────────────────
  const floorLabel    = room.floor ? (FLOOR_LABELS[room.floor] ?? room.floor) : null;
  const occupancy     = room.currentOccupancy ?? 0;
  const capacity      = room.capacity ?? 0;
  const occupancyPct  = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;
  const occupancyBarColor =
    occupancyPct >= 100 ? "#ef4444" :
    occupancyPct >= 75  ? "#f59e0b" :
                          "#10b981";

  return (
    <div
      className="drawer-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="drawer">
        {/* ── HEADER ── */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Room #{room.room_Id}</h2>
            <p className="drawer-subtitle">{room.hostelName ?? "Hostel"}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* ── BODY ── */}
        <div className="drawer-body">

          {/* IMAGE CAROUSEL */}
          <div className="detail-image-wrap" style={{ position: "relative", overflow: "hidden" }}>
            {images.length > 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    width: `${images.length * 100}%`,
                    transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
                    transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${100 / images.length}%`, height: "100%", flexShrink: 0 }}
                    >
                      <img
                        src={`${MainUrl}/images/${img}`}
                        alt={`Room ${idx + 1}`}
                        className="detail-image"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>

                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      style={{
                        position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                        zIndex: 10, width: "34px", height: "34px", borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)", border: "none", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.8)")}
                      onMouseOut={(e)  => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.55)")}
                      aria-label="Previous image"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      style={{
                        position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                        zIndex: 10, width: "34px", height: "34px", borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)", border: "none", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.8)")}
                      onMouseOut={(e)  => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.55)")}
                      aria-label="Next image"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Dot indicators */}
                    <div
                      style={{
                        position: "absolute", bottom: "10px", left: "50%",
                        transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10,
                      }}
                    >
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                          style={{
                            width: idx === currentIndex ? "20px" : "6px", height: "6px",
                            borderRadius: "9999px",
                            background: idx === currentIndex ? "#fff" : "rgba(255,255,255,0.45)",
                            border: "none", cursor: "pointer", transition: "all 0.25s", padding: 0,
                          }}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Counter */}
                    <div
                      style={{
                        position: "absolute", top: "10px", right: "10px",
                        background: "rgba(0,0,0,0.5)", color: "#fff",
                        fontSize: "11px", fontWeight: 600,
                        padding: "2px 8px", borderRadius: "999px", zIndex: 10,
                      }}
                    >
                      {currentIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="detail-image-placeholder">
                <span style={{ fontSize: 56 }}>🏠</span>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div
              style={{
                display: "flex", gap: "6px", marginTop: "10px",
                overflowX: "auto", paddingBottom: "4px",
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    flexShrink: 0, width: "52px", height: "40px", borderRadius: "6px",
                    overflow: "hidden",
                    border: idx === currentIndex ? "2px solid #3b82f6" : "2px solid transparent",
                    cursor: "pointer", padding: 0, transition: "border-color 0.2s",
                    opacity: idx === currentIndex ? 1 : 0.6,
                  }}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <img
                    src={`${MainUrl}/images/${img}`}
                    alt={`Thumb ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* ── INFO GRID ── */}
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{isBookedToday ? "Occupied" : status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price</span>
              <span className="info-value">Rs {room.room_Price.toLocaleString()}/night</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hostel ID</span>
              <span className="info-value mono">{room.hostelId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Room ID</span>
              <span className="info-value mono">{room.room_Id}</span>
            </div>

            {/* ── NEW: Room Type ── */}
            {room.roomType && (
              <div className="info-item">
                <span className="info-label">Room Type</span>
                <span className="info-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 10V6a1 1 0 011-1h16a1 1 0 011 1v4M3 10h18M3 10v8m18-8v8M3 18h18" />
                  </svg>
                  {room.roomType}
                </span>
              </div>
            )}

            {/* ── NEW: Floor ── */}
            {floorLabel && (
              <div className="info-item">
                <span className="info-label">Floor</span>
                <span className="info-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3m4-3v3m4-3v3" />
                  </svg>
                  {floorLabel}
                </span>
              </div>
            )}

            {/* ── NEW: Capacity ── */}
            {capacity > 0 && (
              <div className="info-item">
                <span className="info-label">Capacity</span>
                <span className="info-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  {capacity} persons
                </span>
              </div>
            )}

            {/* ── NEW: Current Occupancy ── */}
            {capacity > 0 && (
              <div className="info-item">
                <span className="info-label">Occupancy</span>
                <span className="info-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  {occupancy} / {capacity}
                </span>
              </div>
            )}
          </div>

          {/* ── NEW: Occupancy progress bar ── */}
          {capacity > 0 && (
            <div style={{ marginTop: "4px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Occupancy rate
                </span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: occupancyBarColor }}>
                  {occupancyPct}%
                </span>
              </div>
              <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: "9999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(occupancyPct, 100)}%`,
                    background: occupancyBarColor,
                    borderRadius: "9999px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── DESCRIPTION ── */}
          <div className="info-item full-width">
            <span className="info-label">Description</span>
            <p className="info-value">{room.room_Description}</p>
          </div>

          {/* ── BOOKED STATUS ── */}
          {isBookedToday && (
            <div
              style={{
                marginTop: "20px", padding: "16px", borderRadius: "14px",
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                  Currently Booked
                </div>
                <div style={{ marginTop: "6px", color: "#fff" }}>
                  Available after <strong>{bookedTill}</strong>
                </div>
              </div>
              <div style={{ fontSize: "2rem" }}>🔒</div>
            </div>
          )}

          {/* ── NEW: UPCOMING BOOKING NOTICE (only when free today) ── */}
          {!isBookedToday && upcomingCheckIn && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#f59e0b",
              }}
            >
              <span>📅</span>
              <span>Booked for {upcomingCheckIn}</span>
            </div>
          )}

          {/* ── BOOKING HISTORY ── */}
          <div className="section">
            <h4 className="section-title">Booking History ({bookings.length})</h4>
            {bookings.length === 0 ? (
              <div className="empty-state">No bookings yet</div>
            ) : (
              <div className="booking-list">
                {bookings.map((b: any, i: number) => (
                  <div key={b.booking_Id ?? i} className="booking-item">
                    <div className="booking-dates">
                      <span>{formatDate(b.check_In_Date || b.checkIn || b.checkInDate)}</span>
                      <span>→</span>
                      <span>{formatDate(b.check_Out_Date || b.checkOut || b.checkOutDate)}</span>
                    </div>
                    <span className="booking-status-tag">{b.status ?? "Pending"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CUSTOMERS ── */}
          <div className="section">
            <h4 className="section-title">Customers ({room.customers?.length ?? 0})</h4>
            {room.customers?.length === 0 ? (
              <div className="empty-state">No customers</div>
            ) : (
              <div className="customer-list">
                {room.customers?.map((c: any, i: number) => (
                  <div key={c.customer_Id ?? i} className="customer-item">
                    <div className="customer-avatar">
                      {c.customer_Name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="customer-name">{c.customer_Name ?? "Unknown"}</p>
                      <p className="customer-email">{c.customer_Email ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="drawer-footer">
          {isBookedToday ? (
            <button
              className="btn full-width"
              disabled
              style={{ background: "#dc2626", color: "#fff", cursor: "not-allowed" }}
            >
              Booked Until {bookedTill}
            </button>
          ) : status === "Available" ? (
            <button
              className="btn btn-primary full-width"
              onClick={() => { onClose(); onBook(room); }}
            >
              Book This Room · Rs {room.room_Price.toLocaleString()}/night
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
