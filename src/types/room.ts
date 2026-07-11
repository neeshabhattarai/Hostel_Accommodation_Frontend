export interface Booking {
  booking_Id: number;
  check_In_Date: string;
  check_Out_Date: string;
}

export interface Room {
  room_Id: string;
  hostelName: string;
  roomType: string;
  hostelAddress: string;
  room_Description: string;
  room_Image: string;
  room_Price: number;
  bookings: Booking[];
  floor: string;
  capacity: number;
  currentOccupancy: number;
}
export interface RoomId{
  room_Id: string;

}
  
  export interface Customer {
    customer_Id?: string;
    customer_Name?: string;
    customer_Email?: string;
  }
  
  export interface Room {
    room_Id: string;
    room_Description: string;
    status: string | null;
    hostelName: string | null;
    hostelId: string;
    room_Price: number;
    // Optional because some backends might not return capacity.
    room_Capacity?: number;
    room_Image: string;
    customers: Customer[];
    bookings: Booking[];
  }
  
  export interface BookingForm {
    checkIn: string;
    checkOut: string;
  
  }