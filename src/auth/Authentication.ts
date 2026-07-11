import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  // createdAt: string;
  // Add other fields returned by your API
  // hostelId?: string;
  // phoneNumber?: string;
}

interface AuthState {
  token: string | null;
  role: string | null;
  user: User | null;

  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setUser: (user: User) => void;

  clearToken: () => void;
  clearUser: () => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      user: null,

      setToken: (token) => set({ token }),

      setRole: (role) => set({ role }),

      setUser: (user) => set({ user }),

      clearToken: () =>
        set({
          token: null,
          role: null,
          user: null,
        }),

      clearUser: () => set({ user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-store",
    }
  )
);