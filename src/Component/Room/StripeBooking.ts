import type { BookingFormData } from './BookingModal';
import {bookingApi} from '../../api/Booking';
import type { Room } from '../../types/room';

export default async function StripeBooking({
  data, checkIn, checkOut, room, total, nights, token
}: {
  data: BookingFormData, checkIn: string, checkOut: string,
  room: Room, total: number, nights: number, token: string
}) {
  try {
    const responseBooking = await bookingApi.create({
      CheckInDate: checkIn,
      CheckOutDate: checkOut,
      RoomId: room.room_Id,
      TotalPayments: total,
      RoomPrice: room.room_Price,
      NoofNights: nights,
    });
  
    const bookingId = responseBooking.data.bookingId;
  
    // console.log("Booking Id:", bookingId);
  
    const response = await fetch(
      "http://localhost:5109/api/stripe/CreateCheckoutSession/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.room_Id,
          roomName: room.room_Id,
          amount: total,
          nights,
          guests: data.guests,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          currency: "npr",
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/booking/cancel`,
          bookingId,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to create Stripe checkout session.");
    }
  
    const result = await response.json();
  
    return result;
  } catch (error: any) {
    console.error(error);
  
    if (error.response) {
      // Axios error from booking API
      const message =
        error.response.data?.message || "Booking failed.";
  
      // alert(message);
  
      return {
        success: false,
        message,
      };
    }
  
    // Other errors (fetch/network/etc.)
    alert(error.message || "Something went wrong.");
  
    return {
      success: false,
      message: error.message,
    };
  }
  
}