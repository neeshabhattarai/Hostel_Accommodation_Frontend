import { useState, type JSX } from "react";
import type { Booking } from "../../types/booking.types";

/* ── Types ─────────────────────────────────────────────────────────── */
interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  onView: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onDelete: (b: Booking) => void;
}

interface BookingRowProps {
  b: Booking;
  onView: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onDelete: (b: Booking) => void;
}

interface ActionBtnProps {
  icon: string;
  label: string;
  hoverClass: string;
  onClick: () => void;
}

/* ── Helpers ───────────────────────────────────────────────────────── */
const COLS = [

  "Booking ID",
  "Booked On",
  "Check-in",
  "Check-out",
  "Status",
  "Room",
  "Nights",
  "Price / Night",
  "Total",
  "Actions",
] as const;

const fmtDate = (d: string): string =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

/* ── SkeletonRow ───────────────────────────────────────────────────── */
function SkeletonRow(): JSX.Element {
  return (
    <tr>
      {COLS.map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 bg-gray-100 rounded animate-pulse"
            style={{ opacity: 1 - i * 0.07 }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ── ActionBtn ─────────────────────────────────────────────────────── */
function ActionBtn({ icon, label, hoverClass, onClick }: ActionBtnProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        w-7 h-7 rounded-md border flex items-center justify-center
        text-sm transition-all duration-150 cursor-pointer
        hover:-translate-y-0.5 hover:shadow-sm
        ${hovered ? hoverClass : "bg-white border-gray-200"}
      `}
    >
      {icon}
    </button>
  );
}

/* ── BookingRow ────────────────────────────────────────────────────── */
function BookingRow({ b, onView, onEdit, onDelete }: BookingRowProps): JSX.Element {
  const [hover, setHover] = useState<boolean>(false);
  const countNight=()=>{
    const checkIn = new Date(b.checkInDate).getTime();
    const checkOut = new Date(b.checkOutDate).getTime();
    const nights = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights;
  };

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`transition-colors duration-100 ${hover ? "bg-blue-50/40" : "bg-white"}`}
    >
      {/* Booking ID */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {b.bookingId}
        </span>
      </td>

      {/* Booked On */}
      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
        {fmtDate(b.bookingDate)}
      </td>

      {/* Check-in */}
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
        {fmtDate(b.checkInDate)}
      </td>

      {/* Check-out */}
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
        {fmtDate(b.checkOutDate)}
      </td>

      {/* Status */}
      <td className={`px-4 py-3 text-sm text-gray-700 whitespace-nowrap  ${b.bookingStatus === "Pending" ? "text-yellow-500" : b.bookingStatus === "Confirmed" ? "text-green-500" : b.bookingStatus === "Completed" ? "text-green-500" : b.bookingStatus === "Cancelled" ? "text-red-500" : ""}`}>
        {b.bookingStatus}
      </td>

      {/* Room */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
          #{b.room.room_Id}
        </span>
      </td>

      {/* Nights */}
      <td className="px-4 py-3 text-sm text-center text-gray-700">
        {countNight()}
      </td>

      {/* Price / Night */}
      <td className="px-4 py-3 text-sm text-gray-700">
        NPR{b["room"].room_Price}
      </td>

      {/* Total */}
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        NPR{b["room"].room_Price * countNight()}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <ActionBtn
            icon="👁"
            label="View"
            hoverClass="bg-blue-50 border-blue-200"
            onClick={() => onView(b)}
          />
          <ActionBtn
            icon="✏️"
            label="Edit"
            hoverClass="bg-yellow-50 border-yellow-200"
            onClick={() => onEdit(b)}
          />
          <ActionBtn
            icon="🗑"
            label="Delete"
            hoverClass="bg-red-50 border-red-200"
            onClick={() => onDelete(b)}
          />
        </div>
      </td>
    </tr>
  );
}

/* ── BookingTable ──────────────────────────────────────────────────── */
export function BookingTableForAdmin({
  bookings,
  loading,
  onView,
  onEdit,
  onDelete,
}: BookingTableProps): JSX.Element {
  return (
    <div className="bg-white border  border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {COLS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50 ">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : bookings.length === 0 ? (
              <tr className="">
                <td colSpan={COLS.length} className="py-16 text-center text-gray-400">
                  <div className="text-4xl mt-10 mb-3">📋</div>
                  <p className="text-sm">No bookings found</p>
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <BookingRow
                  key={b.id}
                  b={b}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
