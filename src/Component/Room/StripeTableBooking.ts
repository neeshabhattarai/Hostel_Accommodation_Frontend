import type { BookingFormData } from './BookingModal';
import type {  RoomId } from '../../types/room';

export default async function StripeBookingByTable({
  data,  room, total, nights, token,bookingId
}: {
  data: BookingFormData, 
  room: RoomId, total: number, nights: number, token: string,bookingId:string
}) {
  const id = bookingId;
console.log(room);
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
  console.log(response);

  if (!response.ok) throw new Error("Failed to create Stripe session");

  // Return parsed JSON so the caller can access the session URL
  return await response.json();
}