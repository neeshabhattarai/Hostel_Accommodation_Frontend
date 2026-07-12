import type { BookingFormData } from './BookingModal';
import {bookingApi} from '../../api/Booking';
import type { Room } from '../../types/room';

export default async function StripeBooking({
  data, checkIn, checkOut, room, total, nights, token
}: {
  data: BookingFormData, checkIn: string, checkOut: string,
  room: Room, total: number, nights: number, token: string
}) {
  const responseBooking = await bookingApi.create(JSON.stringify({
    CheckInDate: checkIn,
    CheckOutDate: checkOut,
    RoomId: room.room_Id,
    TotalPayments: total,
    RoomPrice: room.room_Price,
    NoofNights: nights,
  }));
  console.log(responseBooking);

  const id = responseBooking.bookingId;
  console.log(id);
  const response = await fetch(
    `http://localhost:5109/api/stripe/CreateCheckoutSession/create-checkout-session`,
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
        bookingId: id
      }),
    }
  );
const result=await response.json();

  if (!response.ok) throw new Error(result.message);

  // Return parsed JSON so the caller can access the session URL
  return result;
}