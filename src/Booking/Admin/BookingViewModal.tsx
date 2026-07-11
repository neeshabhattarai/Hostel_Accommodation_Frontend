import type{ Booking } from "../../types/booking.types";

interface BookingViewModalProps {
  booking: Booking;
  onClose: () => void;
  onEdit: () => void;
}

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

interface RowProps {
  label: string;
  value: string | number;
  accent?: boolean;
}
function Row({ label, value, accent }: RowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={accent ? "text-blue-600 font-bold text-base" : "text-gray-800 font-medium"}>
        {value}
      </span>
    </div>
  );
}

export function BookingViewModal({ booking: b, onClose, onEdit }: BookingViewModalProps) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-lg font-bold text-blue-600">{b.id}</p>
          <p className="text-xs text-gray-400 mt-0.5">Booking Details</p>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer">
          ✕
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Dates</p>
          <Row label="Booked On"  value={fmt(b.bookingDate)} />
          <Row label="Check-in"   value={fmt(b.checkInDate)} />
          <Row label="Check-out"  value={fmt(b.checkOutDate)} />
          <Row label="Nights"     value={b.noofNights} />
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Room &amp; Payment</p>
          <Row label="Room ID"        value={`#${b.roomId}`} />
          <Row label="Price / Night"  value={`$${b.roomPrice}`} />
          <Row label="Total Payment"  value={`$${b.totalPayments}`} accent />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-5 pt-5 border-t border-gray-100">
        <button onClick={onClose}
          className="h-9 px-4 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          Close
        </button>
        <button onClick={onEdit}
          className="h-9 px-5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
          Edit Booking
        </button>
      </div>
    </div>
  );
}
