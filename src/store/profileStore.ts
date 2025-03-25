import { create } from "zustand"
import { persist } from "zustand/middleware"

type ProfileStore = {
  profile: ProfileType
  signIn: (profile: ProfileType) => void
  signOut: () => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: { isLoggedIn: false },
      signIn: (profile) => set({ profile: { isLoggedIn: true, ...profile } }),
      signOut: () => set({ profile: { isLoggedIn: false } }),
    }),
    { name: "profile-storage" },
  ),
)
