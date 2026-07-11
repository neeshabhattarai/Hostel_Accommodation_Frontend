import axios from "axios";
import type { Hostel, HostelFormValues } from "../types/hostel";
import BaseUrl from "./BaseUrl";
import { useAuthStore } from "../auth/Authentication";

export const apiClient = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const isAuthenticated = useAuthStore.getState().isAuthenticated();


    if (isAuthenticated && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

export const hostelApi = {
  // Get all hostels
  getAll: async (): Promise<Hostel[]> => {
    const response = await apiClient.get(
      "/Hostel/GetHostels?pageNumber=1&pageSize=5"
    );
    const datas=response.data?._data;

    // Adjust this if your API returns:
    // { data: [...] } or { items: [...] }
    return Array.isArray(datas)
      ? datas
      :  [];
  },

  // Get hostel by id
  getById: async (id: string): Promise<Hostel> => {
    const response = await apiClient.get(`/Hostel/GetHostelById/${id}`);
    return response.data;
  },

  // Create hostel
  create: async (
    data: HostelFormValues
  ): Promise<Hostel> => {
    const response = await apiClient.post(
      "/Hostel/CreateHostel",
      data
    );

    return response.data;
  },

  // Update hostel
  update: async (
    id: string,
    data: HostelFormValues
  ): Promise<Hostel> => {
    const response = await apiClient.put(
      `/Hostel/UpdateHostel/${id}`,
      data,
      
    );

    return response.data;
  },

  // Delete hostel
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/Hostel/DeleteHostel/${id}`);
  },
};