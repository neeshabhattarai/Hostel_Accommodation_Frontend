import type { FormState } from "../types/booking.types";
import { today } from "../utils/booking.helper";

export const INIT: FormState = {
  customerEmail: "",
  bookingDate: today(),
  checkInDate: "",
  checkOutDate: "",
  roomId: "",
  roomPrice: "",
  remarks: "",
};