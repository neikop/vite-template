import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  clearUser: () => void
  setUser: (user: LoginResponse) => void
  user: LoginResponse | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      clearUser: () => set({ user: null }),
      setUser: (user) => set({ user }),
      user: null,
    }),
    {
      name: "user-storage",
    },
  ),
)
