import { useState } from "react";
import { useLoaderData } from "react-router-dom";

/* ---------- types (same) ---------- */
interface Room {
  room_Id: string | number;
  room_Type?: string;
  room_Price?: number;
}

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "CheckedIn"
  | "CheckedOut"
  | "Cancelled";

interface Booking {
  bookingId: string | number;
  roomId: string | number;
  bookingStatus: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
}

interface LoaderData {
  rooms: Room[];
  bookings: Booking[];
}

/* ---------- helpers ---------- */
const countNights = (from: string, to: string) => {
  const a = new Date(from);
  const b = new Date(to);
  return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86400000));
};

/* ---------- UI ---------- */
function MetricCard({
  label,
  value,
  note,
  noteClass = "text-slate-500",
}: {
  label: string;
  value: string | number;
  note: string;
  noteClass?: string;
}) {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 hover:shadow-md transition">
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
      <p className={`text-xs mt-1 ${noteClass}`}>{note}</p>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-3 hover:scale-[1.02] transition">
      <p className="text-sm font-semibold text-slate-800">Room #{room.room_Id}</p>
      <p className="text-xs text-slate-500 mt-1">{room.room_Type}</p>
      <p className="text-xs font-medium text-teal-600 mt-2">
        NPR {room.room_Price ?? 0}
      </p>
    </div>
  );
}

function BookingRow({ b, room }: { b: Booking; room?: Room }) {
  const statusColor =
    b.bookingStatus === "Pending"
      ? "bg-amber-100 text-amber-700"
      : b.bookingStatus === "Confirmed"
      ? "bg-blue-100 text-blue-700"
      : b.bookingStatus === "CheckedIn"
      ? "bg-green-100 text-green-700"
      : b.bookingStatus === "CheckedOut"
      ? "bg-slate-200 text-slate-700"
      : "bg-red-100 text-red-700";

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-4 py-2 font-medium text-slate-700">{b.bookingId}</td>
      <td className="px-4 py-2 text-slate-600">{b.roomId}</td>
      <td className="px-4 py-2 text-slate-600">{room?.room_Type ?? "-"}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {b.bookingStatus}
        </span>
      </td>
      <td className="px-4 py-2 text-slate-600">
        {countNights(b.checkInDate, b.checkOutDate)} nights
      </td>
    </tr>
  );
}

/* ---------- main ---------- */
export default function HostelDashboard() {
  const res = useLoaderData() as LoaderData;

  const rooms = res.rooms ?? [];
  const bookings = res.bookings ?? [];

  const [roomSearch, setRoomSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] =
    useState<BookingStatus | "All">("All");

  /* counts */
  const counts = {
    total: bookings.length,
    pending: bookings.filter(b => b.bookingStatus === "Pending").length,
    confirmed: bookings.filter(b => b.bookingStatus === "Confirmed").length,
    checkedIn: bookings.filter(b => b.bookingStatus === "CheckedIn").length,
    checkedOut: bookings.filter(b => b.bookingStatus === "CheckedOut").length,
    cancelled: bookings.filter(b => b.bookingStatus === "Cancelled").length,
  };

  /* filters */
  const filteredBookings = bookings.filter(b =>
    (bookingStatusFilter === "All" || b.bookingStatus === bookingStatusFilter) &&
    (bookingSearch === "" ||
      String(b.bookingId).includes(bookingSearch) ||
      String(b.roomId).includes(bookingSearch))
  );

  const filteredRooms = rooms.filter(r =>
    roomSearch === "" ||
    String(r.room_Id).includes(roomSearch) ||
    r.room_Type?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  const totalRevenue = bookings.reduce((acc, b) => {
    const room = rooms.find(r => String(r.room_Id) === String(b.roomId));
    return acc + (room?.room_Price ?? 0) *
      countNights(b.checkInDate, b.checkOutDate);
  }, 0);

  const activeBookings = bookings.filter(b => {
    const now = new Date();
    return new Date(b.checkInDate) <= now && now <= new Date(b.checkOutDate);
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hostel Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            {new Date().toDateString()}
          </p>
        </div>

        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm shadow">
          + New Booking
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MetricCard label="Total" value={counts.total} note="all bookings" />
        <MetricCard label="Pending" value={counts.pending} note="waiting" noteClass="text-amber-500" />
        <MetricCard label="Confirmed" value={counts.confirmed} note="approved" noteClass="text-blue-500" />
        <MetricCard label="Active" value={activeBookings} note="checked in" noteClass="text-green-500" />
        <MetricCard
          label="Revenue"
          value={`NPR ${totalRevenue.toLocaleString()}`}
          note="earnings"
          noteClass="text-teal-600"
        />
      </div>

      {/* Rooms */}
      <div className="bg-white rounded-xl p-5 shadow mb-6 border">
        <div className="flex justify-between mb-3">
          <p className="text-xs uppercase text-slate-400">Rooms</p>
          <input
            value={roomSearch}
            onChange={e => setRoomSearch(e.target.value)}
            placeholder="Search rooms..."
            className="text-xs px-3 py-1 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-5 gap-3">
          {filteredRooms.map(r => (
            <RoomCard key={r.room_Id} room={r} />
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-xl p-5 shadow border">

        {/* filters */}
        <div className="flex gap-2 flex-wrap mb-3">
          {(["All", "Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setBookingStatusFilter(s)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                bookingStatusFilter === s
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}

          <input
            value={bookingSearch}
            onChange={e => setBookingSearch(e.target.value)}
            placeholder="Search bookings..."
            className="ml-auto text-xs px-3 py-1 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>

        {/* table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-500">
              <th className="p-3">Booking</th>
              <th>Room</th>
              <th>Type</th>
              <th>Status</th>
              <th>Nights</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-6">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <BookingRow
                  key={b.bookingId}
                  b={b}
                  room={rooms.find(r => String(r.room_Id) === String(b.roomId))}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}