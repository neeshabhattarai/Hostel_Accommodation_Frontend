import type{ Booking } from "../../types/booking.types";


interface StatsBarProps {
  bookings: Booking[];
}

export function StatsBar({ bookings }: StatsBarProps) {
  const revenue = bookings.reduce((s, b) => {
    if(b.bookingStatus === "Confirmed"){
      return s + b["room"].room_Price;
    }
    return s;
  }, 0);
  const avgNights = bookings.length
  ? (
      bookings.reduce((s, b) => {
        const checkIn = new Date(b.checkInDate).getTime();
        const checkOut = new Date(b.checkOutDate).getTime();
        const nights = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return s + nights;
      }, 0) / bookings.length
    ).toFixed(1)
  : "0";
  const rooms = new Set(bookings.map((b) => b.roomId)).size;

  const stats = [
    { label: "Total Bookings", value: String(bookings.length), icon: "📋" },
    { label: "Total Revenue",  value: `NPR ${revenue.toLocaleString()}`, icon: "💰" },
    { label: "Avg Stay",       value: `${avgNights} nights`, icon: "🌙" },
    { label: "Unique Rooms",   value: String(rooms), icon: "🏨" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {s.label}
            </span>
            <span className="text-lg">{s.icon}</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
