import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ---------- types (same) ---------- */
interface Room {
  room_Id: string | number;
  roomType?: string;
  room_Price?: number;
}

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Active"
  | "Cancelled";

interface Booking {
  bookingId: string | number;
  roomId: string | number;
  bookingStatus: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  room: Room;
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

const STATUS_COLORS: Record<BookingStatus, string> = {
  Pending: "#f59e0b", // amber-500
  Confirmed: "#3b82f6", // blue-500
  Completed: "#22c55e", // green-500
  Active: "#64748b", // slate-500
  Cancelled: "#ef4444", // red-500
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
      :  b.bookingStatus === "Completed"
      ? "bg-green-100 text-green-700"
      : b.bookingStatus === "Active"
      ? "bg-slate-200 text-slate-700"
      : "bg-red-100 text-red-700";

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-4 py-2 font-medium text-slate-700">{b.bookingId}</td>
      <td className="px-4 py-2 text-slate-600">{room?.room_Id ?? "-"}</td>

      <td className="px-4 py-2 text-slate-600">{room?.roomType ?? "-"}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {b.bookingStatus}
        </span>
      </td>
      <td className="px-4 py-2 text-slate-600">
        {countNights(b.checkInDate, b.checkOutDate)} nights
      </td>
      <td className="px-4 py-2 text-slate-600">NRP {(room?.room_Price ?? 0)*countNights(b.checkInDate, b.checkOutDate)}</td>

    </tr>
  );
}

/* ---------- chart tooltips ---------- */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      {label && <p className="font-medium text-slate-700 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.payload?.fill }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

/* ---------- main ---------- */
export default function HostelDashboard() {
  const res = useLoaderData() as LoaderData;

  const rooms = res.rooms ?? [];
  const bookings = res.bookings ?? [];
  console.log(rooms,bookings);

  const [roomSearch, setRoomSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] =
    useState<BookingStatus | "All">("All");

  /* counts  */
  const counts = {
    total: bookings.length,
    pending: bookings.filter(b => b.bookingStatus === "Pending").length,
    confirmed: bookings.filter(b => b.bookingStatus === "Confirmed").length,
    completed: bookings.filter(b => b.bookingStatus === "Completed").length,
    Active: bookings.filter(b => b.bookingStatus === "Active").length,
    cancelled: bookings.filter(b => b.bookingStatus === "Cancelled").length,
  };

  /* filters */
  const filteredBookings = bookings.filter((b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const checkIn = new Date(b.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
  
    const checkOut = new Date(b.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
  
    const isActive =
      b.bookingStatus === "Confirmed" &&
      checkIn <= today &&
      today <checkOut;
  
    const matchesStatus =
      bookingStatusFilter === "All"
        ? true
        : bookingStatusFilter === "Active"
        ? isActive
        : b.bookingStatus === bookingStatusFilter;
  
    return (
      matchesStatus &&
      (bookingSearch === "" ||
        String(b.bookingId).includes(bookingSearch) ||
        String(b.roomId).includes(bookingSearch))
    );
  });

  const filteredRooms = rooms.filter(r =>
    roomSearch === "" ||
    String(r.room_Id).includes(roomSearch) ||
    r.room_Type?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  // const totalRevenue = bookings.reduce((acc, b) => {
  //   const room = rooms.find(r => String(r.roomId) === String(b.roomId));
  //   // console.log(room?.room_Price,b.checkInDate,b.checkOutDate);
  //   return acc + (room?.room_Price ?? 0) *
  //     countNights(b.checkInDate, b.checkOutDate);
  // }, 0);
  

  const activeBookings = bookings.filter(b => {
   
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkIn = new Date(b.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(b.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
    // console.log(checkIn<=now,now<=checkOut);
    return checkIn <= now && now < checkOut;
  }).length;

  /* ---------- chart data ---------- */
  const statusPieData = (
    ["Pending", "Confirmed", "Completed", "Active", "Cancelled"] as const
  )
    .map(status => ({
      name: status,
      value: bookings.filter(b => b.bookingStatus === status).length,
    }))
    .filter(d => d.value > 0);

    const revenueByRoomType = Object.values(
      bookings
        .filter(
          (b) =>
            b.bookingStatus === "Confirmed" ||
            b.bookingStatus === "Completed"
        )
        .reduce((acc, b) => {
          const room = rooms.find(
            (r) => String(r.room_Id) === String(b.room.room_Id)
          );
    
          const type = room?.roomType ?? "Unknown";
          const revenue =
            (room?.room_Price ?? 0) *
            countNights(b.checkInDate, b.checkOutDate);
    
          if (!acc[type]) {
            acc[type] = { type, revenue: 0, bookings: 0 };
          }
    
          acc[type].revenue += revenue;
          acc[type].bookings += 1;
    
          return acc;
        }, {} as Record<string, { type: string; revenue: number; bookings: number }>)
    );

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
        <MetricCard label="Active" value={activeBookings} note="waiting" noteClass="text-amber-500" />
        <MetricCard label="Confirmed" value={counts.confirmed} note="approved" noteClass="text-blue-500" />
        <MetricCard label="Completed" value={counts.completed} note="completed" noteClass="text-green-500" />
        <MetricCard
          label="Revenue"
          value={`NPR ${revenueByRoomType.reduce((acc, b) => acc + b.revenue, 0).toLocaleString()}`}
          note="earnings"
          noteClass="text-teal-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Revenue by room type - bar chart */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow border">
          <p className="text-xs uppercase text-slate-400 mb-3">Revenue by Room Type</p>
          {revenueByRoomType.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueByRoomType} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#034523" }} />
                <Bar dataKey="revenue" name="Revenue (NPR)" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booking status - pie chart */}
        <div className="bg-white rounded-xl p-5 shadow border">
          <p className="text-xs uppercase text-slate-400 mb-3">Booking Status</p>
          {statusPieData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusPieData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name as BookingStatus]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
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
          {(["All", "Pending", "Confirmed", "Completed", "Active", "Cancelled"] as const).map(s => (
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
              <th>Total</th>
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
                  room={rooms.find(r => String(r.room_Id) === String(b["room"]?.room_Id ?? b.roomId))}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
