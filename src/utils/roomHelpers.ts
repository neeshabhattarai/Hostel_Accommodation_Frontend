import type { Room } from "../types/room";

export function getRoomStatus(
  room: Room
): "Available" | "Booked" | "Occupied" | "Maintenance" {
  const bookings = room.bookings ?? [];

  const hasMaintenance = bookings.some((booking) =>
    booking["bookingStatus"]?.toLowerCase().includes("maintenance")
  );

  if (hasMaintenance) {
    return "Maintenance";
  }

  const hasConfirmed = bookings.some((booking) =>
    booking["bookingStatus"]?.toLowerCase().includes("confirmed")
  );

  if (hasConfirmed) {
    return "Booked";
  }

  const hasPending = bookings.some((booking) =>
    booking["bookingStatus"].toLowerCase().includes("pending")
  );

  if (hasPending) {
    return "Occupied";
  }

  return "Available";
}

export function getNights(
  checkIn: string,
  checkOut: string
): number {
  if (!checkIn || !checkOut) return 0;

  const diff =
    new Date(checkOut).getTime() -
    new Date(checkIn).getTime();

  return Math.max(
    0,
    Math.ceil(diff / (1000 * 60 * 60 * 24))
  );
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}