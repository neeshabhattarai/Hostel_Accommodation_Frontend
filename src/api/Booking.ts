import axios from "axios";
import BaseUrl from "./BaseUrl";
import GetToken from "./GetTokenDetails";
import type { BookingFilters, BookingFormData } from "../types/booking.types";

 export const getAuthConfig = () => {
  const { token, isAuthenticated } = GetToken();

  if (!isAuthenticated()) {
    return null;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const bookingApi = {
  getAll: async (filters?: BookingFilters) => {
    const config = getAuthConfig();

    if (!config) return null;

    const response = await axios.get(
      `${BaseUrl}/GetAllBooking?pageSize=5&pageIndex=1`,
      {
        ...config,
        params: filters,
      }
    );
    // console.log(response.data);
    return response.data;
  },

  getById: async (id: string) => {
    const config = getAuthConfig();

    if (!config) return null;

    const response = await axios.get(
      `${BaseUrl}/GetBookingById/${id}`,
      config
    );

    return response.data;
  },
  getByCustomerId: async () => {
    const config = getAuthConfig();

    if (!config) return null;

    const response = await axios.get(
      `${BaseUrl}/GetCustomerBookingById`,
      config
    );

    return response.data;
  },

  create: async (data: BookingFormData) => {
    const config = getAuthConfig();

    if (!config) return null;

    const response = await axios.post(
      `${BaseUrl}/CreateBooking`,
      data,
      config
    );

    return response.data;
  },

  update: async (
    id: string,
    data: Partial<BookingFormData>
  ) => {
    const config = getAuthConfig();

    if (!config) return null;

    const response = await axios.patch(
      `${BaseUrl}/UpdateBookingById/${id}`,
      data,
      config
    );

    return response.data;
  },
  cancelBooking: async (id: string) => {
    const config = getAuthConfig();
    if (!config) return null;
    const response = await axios.get(
      `${BaseUrl}/CancelBooking/${id}`,
      config
    );
    return response.status;
  },

  delete: async (id: string) => {
    const config = getAuthConfig();

    if (!config) return null;
// alert(id);
    await axios.delete(
      `${BaseUrl}/DeleteBooking/${id}`,
      config
    );
  },
  getAllBookings: async (filters?: BookingFilters) => {
    const config = getAuthConfig();
    if (!config) return null;
    const response = await axios.get(
      `${BaseUrl}/GetAllBookings/allBooking`,
      {
        ...config,
        params: filters,
      }
    );
    return response.data;
  },
};