import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TitleState {
  clearTitle: () => void
  setTitle: (newTitle: string) => void
  title: null | string
}

export const useTitleStore = create<TitleState>()(
  persist(
    (set) => ({
      clearTitle: () => set({ title: null }),
      setTitle: (newTitle) => set({ title: newTitle }),
      title: null,
    }),
    {
      name: "title-storage",
    },
  ),
)
