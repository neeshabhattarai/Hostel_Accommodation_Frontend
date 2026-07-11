import { useState, useEffect, useCallback } from "react";
import { bookingApi } from "../api/Booking";
import type{ Booking, BookingFormData, BookingFilters } from "../types/booking.types";

export function useBookings(filters?: BookingFilters) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getAll(filters);
      setBookings(res._data);
    } catch (e:any) {
      setError(e.message ?? "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.fromDate, filters?.toDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (data: BookingFormData): Promise<Booking> => {
    const booking = await bookingApi.create(data);
    await fetchBookings();
    return booking;
  };

  const updateBooking = async (id: string, data: Partial<BookingFormData>): Promise<Booking> => {
    const booking = await bookingApi.update(id, data);
    await fetchBookings();
    return booking;
  };

  const deleteBooking = async (id: string): Promise<void> => {
    await bookingApi.delete(id);
    await fetchBookings();
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
}
