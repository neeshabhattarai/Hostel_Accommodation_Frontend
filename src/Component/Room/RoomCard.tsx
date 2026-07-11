import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MainUrl } from "../../api/BaseUrl";
import type { Booking, Room } from "../../types/room";
import { getRoomStatus } from "../../utils/roomHelpers";
import StatusBadge from "./StatusBadge";
import { useAuthStore } from "../../auth/Authentication";
import BookingModal from "./BookingModal";

interface Props {
  room: Room;
  bookings: Booking[];
  onViewDetails: (room: Room) => void;
  matchPercentage?: number;
}

// Maps C# enum string → human-readable label
const FLOOR_LABELS: Record<string, string> = {
  GroundFloor: "Ground Floor",
  FirstFloor: "First Floor",
  SecondFloor: "Second Floor",
  ThirdFloor: "Third Floor",
  FourthFloor: "Fourth Floor",
};

export default function RoomCard({
  room,
  onViewDetails,
  matchPercentage,
}: Props) {
  const status = getRoomStatus(room);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Normalise images — support single string OR array
  const images: string[] = Array.isArray(room.room_Image)
    ? room.room_Image
    : room.room_Image
      ? [room.room_Image]
      : [];

  const hasMultiple = images.length > 1;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((i) => (i + 1) % images.length);
    },
    [images.length],
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBooking = room.bookings?.find((booking: any) => {
    const checkIn = new Date(booking.check_In_Date || booking.checkInDate);
    const checkOut = new Date(booking.check_Out_Date || booking.checkOutDate);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    return (
      booking.bookingStatus === "Confirmed" &&
      today >= checkIn &&
      today <= checkOut
    );
  });

  // console.log(room.bookings);

  const isBookedToday = !!activeBooking;

  const bookedTill = activeBooking
    ? new Date(
        activeBooking.check_Out_Date || activeBooking.checkOutDate,
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const isAvailable = !isBookedToday;

  const handleBook = () => {
    if (!isAuthenticated()) {
      toast.error("Please log in to book a room");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  // ── Derived values for new fields ──────────────────────────────────────────
  const floorLabel = room.floor
    ? (FLOOR_LABELS[room.floor] ?? room.floor)
    : null;
  const capacity = room.capacity ?? 0;
  // NOTE: live "currentOccupancy" is intentionally not surfaced on the public
  // card — this hostel books whole rooms (Model 2), so partial-occupancy
  // fractions/bars are misleading. Only static capacity is shown here.
  // If needed elsewhere (admin view, booking modal guest-count input), use
  // room.currentOccupancy directly from the room object.

  return (
    <>
      <div className="group bg-white overflow-hidden shadow-2xl hover:shadow-blue-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[620px] min-w-[500px]">
        {/* ── IMAGE CAROUSEL ── */}
        <div className="relative h-70 overflow-hidden bg-slate-800">
          {images.length > 0 ? (
            <>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    opacity: idx === currentIndex ? 1 : 0,
                    zIndex: idx === currentIndex ? 1 : 0,
                  }}
                >
                  <img
                    src={`${MainUrl}/images/${img}`}
                    alt={`${room.room_Id} — ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                               w-8 h-8 rounded-full bg-black/50 hover:bg-black/75
                               text-white flex items-center justify-center
                               opacity-0 group-hover:opacity-100
                               transition-all duration-200 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                               w-8 h-8 rounded-full bg-black/50 hover:bg-black/75
                               text-white flex items-center justify-center
                               opacity-0 group-hover:opacity-100
                               transition-all duration-200 cursor-pointer"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`rounded-full transition-all duration-200 cursor-pointer ${
                          idx === currentIndex
                            ? "w-5 h-1.5 bg-white"
                            : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full z-10">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-7xl">
              🏠
            </div>
          )}

          <StatusBadge status={isBookedToday ? "Booked" : status} />
        </div>

        {/* ── BODY ── */}
        <div className="p-6 text-left">
          <div className="flex items-center justify-between mb-2">
            {/* Hostel Information */}
            <div className="mt-2 space-y-2">
              <p className="text-lg font-semibold text-black  pb-2">RoomId: {room.room_Id}</p>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21h18M5 21V7l7-4 7 4v14M9 13h6M9 17h6M9 9h6"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {room.hostelName ?? "Hostel Name"}
                </span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="text-sm text-gray-600">
                  {room.hostelAddress ?? "Hostel Address"}
                </span>
              </div>
            </div>

            {matchPercentage !== undefined && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  matchPercentage >= 90
                    ? "bg-emerald-500"
                    : matchPercentage >= 75
                      ? "bg-blue-500"
                      : matchPercentage >= 60
                        ? "bg-amber-500"
                        : "bg-gray-500"
                }`}
              >
                ⭐ {matchPercentage}% Match
              </span>
            )}
          </div>

          <p className="text-slate-900 text-sm leading-relaxed min-h-[70px] mb-4">
            {room.room_Description}
          </p>

          {/* ── Room Type · Floor · Capacity ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {/* Room Type pill */}
            {room.roomType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                {/* bed icon */}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10V6a1 1 0 011-1h16a1 1 0 011 1v4M3 10h18M3 10v8m18-8v8M3 18h18"
                  />
                </svg>
                {room.roomType}
              </span>
            )}

            {/* Floor pill */}
            {floorLabel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
                {/* building icon */}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3m4-3v3m4-3v3"
                  />
                </svg>
                {floorLabel}
              </span>
            )}

            {/* Capacity pill — static "Sleeps X", no live occupancy count */}
            {capacity > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                {/* users icon */}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 4a3 3 0 100-6 3 3 0 000 6zM3 20a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
                Sleeps {capacity}
              </span>
            )}
          </div>

          {/* ── PRICE SECTION ── */}
          <div className="flex justify-between items-center mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Price Per Night
            </div>
            <div className="text-3xl font-extrabold text-black">
              Rs {room.room_Price}
            </div>
            {!isBookedToday && (
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold text-xs">
                Available
              </div>
            )}
          </div>

          {/* ── BOOKING INFO ── */}
          {isBookedToday && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 flex justify-between items-center">
              <div>
                <div className="text-red-400 text-xs font-bold uppercase tracking-wider">
                  Currently Booked
                </div>
                <div className="text-zinc-500 mt-1 text-sm">
                  Available after{" "}
                  <strong className="text-black">{bookedTill}</strong>
                </div>
              </div>
              <div className="text-3xl">🔒</div>
            </div>
          )}

          {/* ── ACTIONS ── */}
          <div className="flex gap-3 mt-2">
            <button
              className="flex-1 h-14 rounded-xl font-semibold from-[#0090FF] to-[#a00f0f] bg-linear-to-l hover:bg-slate-700 text-white transition-all duration-200"
              onClick={() => onViewDetails(room)}
            >
              Details
            </button>

            <button
              className={`flex-1 h-14 rounded-xl font-bold transition-all duration-200 ${
                isAvailable
                  ? "from-[#0090FF] to-[#00FF94] bg-linear-to-l hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-slate-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isAvailable}
              onClick={handleBook}
            >
              {isBookedToday ? "Booked" : isAvailable ? "Book Now" : status}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <BookingModal room={room} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
