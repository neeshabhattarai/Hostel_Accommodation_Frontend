export interface FormState {
    customerEmail: string;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    roomId: string;
    roomPrice: string;
    remarks: string;
  }
  
  export interface Booking {
    bookingId: string;
    customerId: string;
    customerName: string | null;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    rooms: unknown;
    transaction: unknown;
    paymentId: string | null;
    bookingStatus: string;
    paymentStatus: string;
  }
  
  export interface Props {
    booking: Booking;
  }
  export interface Booking {
    id: string;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    roomId: number;
    totalPayments: number;
    roomPrice: number;
    noofNights: number;
  }
  
  export type BookingFormData = Omit<Booking, "id">;
  
  export interface BookingApiResponse {
    data: Booking[];
    total: number;
    page: number;
    pageSize: number;
  }
  
  export interface BookingFilters {
    search?: string;
    fromDate?: string;
    toDate?: string;
  }
  

  export type FormField = keyof FormState;
  
  export type FormErrors = Partial<Record<FormField, string>>;
  
  export type TouchedFields = Partial<Record<FormField, boolean>>;
  
  export type Status = "idle" | "success";