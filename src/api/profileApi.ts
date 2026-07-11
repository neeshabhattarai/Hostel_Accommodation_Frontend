import axios from "axios";
import BaseUrl from "./BaseUrl";
import { useAuthStore, type User } from "../auth/Authentication";

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

export const userApi = {
  // Get all hostels
  updateUser: async (data: User) => {
    const response = await apiClient.patch("/UpdateUser", data);
    return response.data;
  }
};