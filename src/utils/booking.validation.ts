import type { FormErrors, FormState } from "../types/booking.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.customerEmail.trim()) {
    errors.customerEmail = "Email is required.";
  } else if (!EMAIL_RE.test(form.customerEmail.trim())) {
    errors.customerEmail = "Enter valid email.";
  }

  if (!form.bookingDate) {
    errors.bookingDate = "Booking date required.";
  }

  if (!form.checkInDate) {
    errors.checkInDate = "Check-in date required.";
  }

  if (!form.checkOutDate) {
    errors.checkOutDate = "Check-out date required.";
  } else if (
    form.checkInDate &&
    form.checkOutDate <= form.checkInDate
  ) {
    errors.checkOutDate =
      "Check-out must be after check-in.";
  }

  if (!form.roomId.trim()) {
    errors.roomId = "Room ID required.";
  }

  if (!form.roomPrice.trim()) {
    errors.roomPrice = "Room price required.";
  }

  return errors;
}