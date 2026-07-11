import { useState, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { useBookings } from "../../hooks/useBookings";
import type{ Booking, BookingFilters, BookingFormData } from "../../types/booking.types";
import { Modal } from "./Modal";
import { StatsBar } from "./StatsBar";
import  BookingForm from "./BookingForm";
import { BookingViewModal } from "./BookingViewModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Toast } from "./Toast";
import { BookingTableForAdmin } from "./BookingTable";

type ModalMode = "create" | "edit" | "view" | "delete" | null;

export default function BookingApp() {
  const [search, setSearch]     = useState<string>("");
  const [filters, setFilters]   = useState<BookingFilters>({});
  const [mode, setMode]         = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busy, setBusy]         = useState<boolean>(false);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const { bookings, loading, error, createBooking, updateBooking, deleteBooking } = useBookings(filters);

  const notify = (msg: string, type: "success" | "error" = "success"): void => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const close = useCallback((): void => {
    setMode(null);
    setSelected(null);
  }, []);

  const open = (m: ModalMode, b: Booking | null = null): void => {
    setSelected(b);
    setMode(m);
  };

  const handleCreate = async (data: BookingFormData): Promise<void> => {
    setBusy(true);
    try { await createBooking(data); notify("Booking created!"); close(); }
    catch (e: unknown) { notify(e instanceof Error ? e.message : "Error", "error"); }
    finally { setBusy(false); }
  };

  const handleUpdate = async (data: BookingFormData): Promise<void> => {
    if (!selected) return;
    setBusy(true);
    try { await updateBooking(selected.bookingId, data); notify("Booking updated!"); close(); }
    catch (e: unknown) { notify(e instanceof Error ? e.message : "Error", "error"); }
    finally { setBusy(false); }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selected) return;
    setBusy(true);
    try { await deleteBooking(selected.bookingId); notify("Booking deleted"); close(); }
    catch (e: unknown) { notify(e instanceof Error ? e.message : "Error", "error"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 py-8">

        {toast && <Toast {...toast} />}

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Booking Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage reservations, rooms &amp; payments</p>
          </div>
          {/* <button
            onClick={() => open("create")}
            className="h-10 px-5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            + New Booking
          </button> */}
        </div>

        <StatsBar bookings={bookings} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <div className="flex gap-2 flex-1 min-w-[240px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && setFilters({ search })}
              placeholder="Search by ID, room, or date…"
              className="flex-1 h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              onClick={() => setFilters({ search })}
              className="h-9 px-4 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Search
            </button>
            {filters.search && (
              <button
                onClick={() => { setSearch(""); setFilters({}); }}
                className="h-9 px-3 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {loading ? "Loading…" : `${bookings.length} record${bookings.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            ⚠ {error}
          </div>
        )}

        <BookingTableForAdmin
          bookings={bookings}
          loading={loading}
          onView={(b) => open("view", b)}
          onEdit={(b) => open("edit", b)}
          onDelete={(b) => open("delete", b)}
        />

        {/* Create Modal */}
        <Modal open={mode === "create"} onClose={close} maxWidth="max-w-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">New Booking</h2>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">✕</button>
          </div>
          <BookingForm onSubmit={handleCreate} onCancel={close} loading={busy} />
        </Modal>

        {/* Edit Modal */}
        <Modal open={mode === "edit"} onClose={close} maxWidth="max-w-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Edit Booking</h2>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">✕</button>
          </div>
          <BookingForm initial={selected} onSubmit={handleUpdate} onCancel={close} loading={busy} />
        </Modal>

        {/* View Modal */}
        <Modal open={mode === "view"} onClose={close} maxWidth="max-w-md">
          {selected && <BookingViewModal booking={selected} onClose={close} onEdit={() => setMode("edit")} />}
        </Modal>

        {/* Delete Modal */}
        <Modal open={mode === "delete"} onClose={close} maxWidth="max-w-sm">
          <ConfirmDialog
            title="Delete Booking"
            message={`Are you sure you want to delete ${selected?.id}? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={close}
            loading={busy}
          />
        </Modal>

      </div>
    </div>
  );
}
