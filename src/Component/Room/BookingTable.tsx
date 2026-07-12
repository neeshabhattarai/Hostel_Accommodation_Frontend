import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingApi } from "../../api/Booking";
import type { BookingFormData } from "./BookingModal";
import { useAuthStore } from "../../auth/Authentication";
import { toast } from "react-toastify";
import StripeBookingByTable from "./StripeTableBooking";

export interface Booking {
  bookingId: string;
  customerId: string;
  customerName: string | null;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  room: unknown;
  transaction: unknown;
  paymentId: string | null;
  bookingStatus: string;
  paymentStatus: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type BadgeVariant = "yellow" | "green" | "red" | "blue" | "gray";

const StatusBadge = ({
  label,
  variant,
}: {
  label: string;
  variant: BadgeVariant;
}) => {
  const styles: Record<BadgeVariant, string> = {
    yellow: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
    green: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
    red: "bg-red-400/15 text-red-400 border border-red-400/30",
    blue: "bg-sky-400/15 text-sky-400 border border-sky-400/30",
    gray: "bg-slate-400/15 text-slate-400 border border-slate-400/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

const badgeVariant = (status: string): BadgeVariant => {
  const s = status.toLowerCase();
  if (s === "pending") return "yellow";
  if (s === "confirmed") return "green";
  if (s === "cancelled") return "red";
  if (s === "paid") return "green";
  if (s === "failed") return "red";
  return "gray";
};

const Cell = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <td className="p-4 align-top">
    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
      {label}
    </div>
    <div className="text-sm text-slate-200 font-mono break-all">
      {value ?? <span className="text-slate-600 italic font-sans">—</span>}
    </div>
  </td>
);

function BookingRow({ booking, index, handleCancel }: { booking: Booking; index: number; handleCancel: (bookingId: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const token = useAuthStore().token;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canCancel =
    booking.bookingStatus === "Pending" &&
    new Date(booking.checkInDate) > today;
  //check if the check in date is in the past
        const isPreviousDate=(checkInDate:string)=>{
          const checkInDateObj=new Date(checkInDate);
          checkInDateObj.setHours(0, 0, 0, 0);
          const today=new Date();
          today.setHours(0, 0, 0, 0);
          console.log(checkInDateObj.getTime()<today.getTime());
          return checkInDateObj.getTime()<today.getTime();
        }

  // console.log(booking);
  const HandleBooking = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const data: BookingFormData = {
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        guests: 1,
      };

      const night =
        (new Date(booking.checkOutDate).getTime() -
          new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24);
      const total = night > 0 ? night * booking.room["room_Price"] : 0;

      const room = {
        room_Id: booking.room["room_Id"],
        room_Price: booking.room["room_Price"],
      };

      const session = await StripeBookingByTable({
        data,
        room,
        total,
        nights: night,
        token,
        bookingId: booking.bookingId,
      });
      console.log(session);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        toast.error("Could not get Stripe checkout URL");
      }
    } catch {
      toast.error("Booking could not be performed");
    }
  };

  return (
    <>
      {/* Summary row */}
      <tr
        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* # */}
        <td className="py-3.5 pl-5 pr-3 text-xs font-bold text-slate-500 w-10">
          {index + 1}
        </td>

        {/* Booking ID */}
        <td className="py-3.5 pr-4 text-xs text-slate-400 font-mono truncate max-w-[140px]">
          <span title={booking.bookingId}>
            {booking.bookingId.slice(0, 8)}…
          </span>
        </td>

        {/* Customer */}
        <td className="py-3.5 pr-4 text-sm text-white font-sans">
          {booking.customerName ?? (
            <span className="text-slate-500 italic text-xs">Unknown</span>
          )}
        </td>

        {/* Check-in */}
        <td className="py-3.5 pr-4 text-sm font-sans text-emerald-400">
          {fmtDate(booking.checkInDate)}
        </td>

        {/* Check-out */}
        <td className="py-3.5 pr-4 text-sm font-sans text-sky-400">
          {fmtDate(booking.checkOutDate)}
        </td>

        {/* Booking status */}
        <td className="py-3.5 pr-4">
          <StatusBadge
            label={booking.bookingStatus}
            variant={badgeVariant(booking.bookingStatus)}
          />
        </td>

        {/* Payment status */}
        <td className="py-3.5 pr-4">
          <StatusBadge
            label={booking.paymentStatus}
            variant={badgeVariant(booking.paymentStatus)}
          />
        </td>
        <td className="py-3.5 pr-4 flex gap-2">
          <button
            className={`${
              booking.bookingStatus === "Confirmed" || isPreviousDate(booking.checkInDate)
                ? "bg-slate-400"
                : "bg-blue-400"
            } px-5 py-2 rounded text-white`}
            onClick={HandleBooking}
            disabled={booking.paymentStatus === "Confirmed" || isPreviousDate(booking.checkInDate)}
          >
            Book
          </button>

          {canCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel(booking.bookingId);
              }}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded text-white"
            >
              Cancel
            </button>
          )}
        </td>

        {/* Expand toggle */}
        <td className="py-3.5 pr-5 text-slate-500">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-slate-800/30 border-b border-slate-800">
          <td colSpan={8} className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 rounded-lg border border-slate-700/50 overflow-hidden">
              <table className="col-span-2 sm:col-span-3 w-full">
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <Cell label="Booking ID" value={booking.bookingId} />
                    <Cell label="Customer ID" value={booking.customerId} />
                    <Cell
                      label="Customer Name"
                      value={
                        booking.customerName ? (
                          <span className="font-sans font-medium text-white">
                            {booking.customerName}
                          </span>
                        ) : null
                      }
                    />
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <Cell
                      label="Booking Date"
                      value={
                        <span className="font-sans">
                          {fmt(booking.bookingDate)}
                        </span>
                      }
                    />
                    <Cell
                      label="Check-In"
                      value={
                        <span className="font-sans text-emerald-400">
                          {fmtDate(booking.checkInDate)}
                        </span>
                      }
                    />
                    <Cell
                      label="Check-Out"
                      value={
                        <span className="font-sans text-sky-400">
                          {fmtDate(booking.checkOutDate)}
                        </span>
                      }
                    />
                  </tr>
                  <tr>
                    <Cell label="Payment ID" value={booking.paymentId} />
                    <Cell
                      label="Booking Status"
                      value={
                        <StatusBadge
                          label={booking.bookingStatus}
                          variant={badgeVariant(booking.bookingStatus)}
                        />
                      }
                    />
                    <Cell
                      label="Payment Status"
                      value={
                        <StatusBadge
                          label={booking.paymentStatus}
                          variant={badgeVariant(booking.paymentStatus)}
                        />
                      }
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Pagination defaults & helpers ─────────────────────────────────────────
const DEFAULT_PAGE_INDEX = 1; // 1-based, shown in the URL as ?page=
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function PaginationBar({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const endItem = Math.min(pageIndex * pageSize, totalItems);

  const canPrev = pageIndex > 1;
  const canNext = pageIndex < totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
      <div className="text-xs text-slate-500">
        Showing <span className="text-slate-300 font-medium">{startItem}</span>–
        <span className="text-slate-300 font-medium">{endItem}</span> of{" "}
        <span className="text-slate-300 font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Page size selector */}
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        {/* Prev / page indicator / Next */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onPageChange(pageIndex - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs text-slate-400 px-2 min-w-[70px] text-center">
            Page {pageIndex} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!canNext}
            onClick={() => onPageChange(pageIndex + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookingDetailTableForUser() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── URL-driven pagination state ──────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = parseInt(searchParams.get("page") ?? "", 10);
  const rawSize = parseInt(searchParams.get("pageSize") ?? "", 10);

  const pageIndex =
    Number.isFinite(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE_INDEX;
  const pageSize =
    Number.isFinite(rawSize) && PAGE_SIZE_OPTIONS.includes(rawSize)
      ? rawSize
      : DEFAULT_PAGE_SIZE;

  const updateParams = (next: { page?: number; pageSize?: number }) => {
    const params = new URLSearchParams(searchParams);
    if (next.page !== undefined) params.set("page", String(next.page));
    if (next.pageSize !== undefined) params.set("pageSize", String(next.pageSize));
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const handlePageSizeChange = (size: number) => {
    // Changing page size resets back to page 1 to avoid landing on an empty page
    updateParams({ page: 1, pageSize: size });
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));

  // Clamp page index into range once bookings/pageSize are known
  useEffect(() => {
    if (bookings.length === 0) return;
    if (pageIndex > totalPages) {
      updateParams({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings.length, pageSize]);

  const paginatedBookings = bookings.slice(
    (pageIndex - 1) * pageSize,
    (pageIndex - 1) * pageSize + pageSize
  );

  const HandleCancel = async (bookingId: string) => {
    try {
      const response=await bookingApi.cancelBooking(bookingId);
      if(response===200){
        toast.success("Booking cancelled");
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === bookingId
              ? { ...b, bookingStatus: "Cancelled" }
              : b
          )
        );
      }else{
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bookingApi.getByCustomerId();
        console.log(response);
        // Handle both array response and single object
        const data = response || [];
        setBookings(Array.isArray(data) ? data : [data]);
      } catch {
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="w-5 h-5 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
          <span className="text-sm">Loading bookings…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="w-full text-center py-16 text-slate-500 text-sm mt-10">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="w-[70%] mx-auto  mt-28">
      {/* Header */}
      <div className="flex w-full items-center  justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          My Bookings
        </h2>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      {/* Table */}
      <div className="w-full rounded-xl border border-slate-700/60 overflow-x-auto bg-slate-900 shadow-xl">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/60">
              <th className="py-3 pl-5 pr-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 w-10">
                #
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Booking ID
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Customer
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Check-In
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Check-Out
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Booking
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Payment
              </th>
              <th className="py-3 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Book
              </th>
              <th className="py-3 pr-5 w-8" />
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((booking, i) => (
              <BookingRow
                key={booking.bookingId}
                booking={booking}
                index={(pageIndex - 1) * pageSize + i}
                handleCancel={HandleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <PaginationBar
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={bookings.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <p className="mt-3 text-xs text-slate-600 text-right">
        Click any row to expand full details
      </p>
    </div>
  );
}
