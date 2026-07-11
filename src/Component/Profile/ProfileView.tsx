import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/Authentication";
import { bookingApi } from "../../api/Booking";
import { useEffect, useState } from "react";
import type { Booking } from "../../types/booking.types";

// ── Mock bookings — replace with real API data ─────────────────────────────
// const MOCK_BOOKINGS = [
//   {
//     id: 1,
//     roomId: "R-204",
//     hostelName: "Sunrise Hostel",
//     checkIn: "2026-06-20",
//     checkOut: "2026-06-28",
//     status: "Active",
//     amount: 6400,
//   },
//   {
//     id: 2,
//     roomId: "R-108",
//     hostelName: "Hillview Hostel",
//     checkIn: "2026-04-01",
//     checkOut: "2026-04-10",
//     status: "Completed",
//     amount: 9000,
//   },
//   {
//     id: 3,
//     roomId: "R-312",
//     hostelName: "Sunrise Hostel",
//     checkIn: "2026-01-15",
//     checkOut: "2026-01-20",
//     status: "Completed",
//     amount: 5000,
//   },
//   {
//     id: 4,
//     roomId: "R-101",
//     hostelName: "Valley View Hostel",
//     checkIn: "2025-11-05",
//     checkOut: "2025-11-12",
//     status: "Cancelled",
//     amount: 7000,
//   },
// ];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    Completed: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    Cancelled: "bg-red-500/15 text-red-400 border border-red-500/30",
    Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? styles.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "Active" ? "bg-emerald-400 animate-pulse" :
        status === "Cancelled" ? "bg-red-400" : "bg-slate-400"
      }`} />
      {status}
    </span>
  );
}
const getBookings=async()=>{
  const res=await bookingApi.getByCustomerId();
  console.log(res);
  return res ?? [];
}

export default  function ProfileView() {
  const [MOCK_BOOKINGS, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  console.log(MOCK_BOOKINGS);
  useEffect(()=>{
    const fetchBookings=async()=>{
      const res=await getBookings();
      setBookings(res);
    }
    fetchBookings();
  },[]);

  // Pull from your auth store — adjust field names to match yours
  const store = useAuthStore().user;
  console.log(store);
  const name     = (store.firstName ?? "") + " " + (store.lastName ?? "");
  const email    = store.email    ?? "—";
  const phone    = store.phone    ?? "—";
  const address  = store.address  ?? "—";
//   const joinedAt = store.createdAt ?? "—";
  const role     = store.role     ?? "Guest";

  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const totalBookings  = MOCK_BOOKINGS.length;
  const activeBookings = MOCK_BOOKINGS.filter((b) => b.bookingStatus === "Confirmed" && new Date(b.checkInDate) <= new Date() && new Date(b.checkOutDate) >= new Date()).length;
  const totalSpent     = MOCK_BOOKINGS.filter((b) => b.bookingStatus =="Confirmed")
                           .reduce((s, b) => s + b["room"]["room_Price"], 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── HERO CARD ── */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
          {/* Banner */}
          <div
            className="h-32 bg-gradient-to-r from-indigo-600/40 via-violet-600/30 to-indigo-800/40 relative"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.015) 20px,rgba(255,255,255,0.015) 40px)",
            }}
          />

          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-slate-900 shadow-xl flex-shrink-0">
                  {initials}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold !text-white">{name}</h1>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {role}
                    </span>
                  </div>
                  {/* <p className="text-slate-400 text-sm mt-1">Member since {joinedAt}</p> */}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => navigate("/profile/edit")}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors duration-200 self-end sm:self-auto mb-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  ),
                  label: "Email",
                  value: email,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  ),
                  label: "Phone",
                  value: phone,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  ),
                  label: "Address",
                  value: address,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-white text-sm font-medium truncate mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", value: totalBookings, color: "text-indigo-400", bg: "bg-indigo-500/10",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /> },
            { label: "Active Stays", value: activeBookings, color: "text-emerald-400", bg: "bg-emerald-500/10",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /> },
            { label: "Total Spent", value: `Rs ${totalSpent.toLocaleString()}`, color: "text-violet-400", bg: "bg-violet-500/10",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-700/60 rounded-xl p-5 flex flex-col gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{stat.icon}</svg>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOOKING HISTORY ── */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-white font-semibold text-base">Booking History</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              {MOCK_BOOKINGS.length} total
            </span>
          </div>

          <div className="p-5 space-y-3">
            {MOCK_BOOKINGS.length === 0 ? (
              <div className="text-center py-14 text-slate-500">
                <div className="text-5xl mb-3">🏠</div>
                <p className="font-semibold text-slate-400">No bookings yet</p>
                <p className="text-sm mt-1">Your booking history will appear here.</p>
              </div>
            ) : (
              MOCK_BOOKINGS.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {booking.hostelName}
                        <span className="text-slate-400 font-normal ml-2 text-xs">· Room {booking.roomId}</span>
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <StatusPill status={booking.bookingStatus} />
                    <span className="text-sm font-bold text-white">Rs {booking["room"]["room_Price"].toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
