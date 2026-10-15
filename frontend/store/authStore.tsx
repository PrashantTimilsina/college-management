import { create } from "zustand";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
