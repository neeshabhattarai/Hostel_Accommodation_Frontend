import { useMemo } from "react";
import type { Room } from "../types/room";
import { getRoomStatus } from "../utils/roomHelpers";

interface Props {
  rooms: Room[];
  search: string;
  filterStatus:
    | "All"
    | "Available"
    | "Booked"
    | "Occupied"
    | "Maintenance";
  sortBy: "id" | "price-asc" | "price-desc";
}

export function useRoomFilter({
  rooms,
  search,
  filterStatus,
  sortBy,
}: Props) {
  return useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return rooms
      .filter((room) => {
        const matchSearch =
          room.room_Id.toLowerCase().includes(searchText) ||
          room.room_Description
            ?.toLowerCase()
            .includes(searchText) ||
          room.hostelName
            ?.toLowerCase()
            .includes(searchText);

        const matchStatus =
          filterStatus === "All" ||
          getRoomStatus(room) === filterStatus;

        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.room_Price - b.room_Price;

          case "price-desc":
            return b.room_Price - a.room_Price;

          case "id":
          default:
            return a.room_Id.localeCompare(b.room_Id);
        }
      });
  }, [rooms, search, filterStatus, sortBy]);
}