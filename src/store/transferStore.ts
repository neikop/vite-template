import { Chain } from "@rainbow-me/rainbowkit"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type TransferStorage = {
  clear: () => void
  fromChain: Chain | null
  receiveAddress: string
  setFromChain: (chain: Chain | null) => void
  setReceiveAddress: (address: string) => void
  setToken: (token: null | Token) => void
  token: null | Token
}

export const useTransferStore = create<TransferStorage>()(
  persist(
    (set) => ({
      clear: () => set({ fromChain: null, receiveAddress: "", token: null }),
      fromChain: null,
      receiveAddress: "",
      setFromChain: (chain) => set({ fromChain: chain }),
      setReceiveAddress: (address) => set({ receiveAddress: address }),
      setToken: (token) => set({ token }),
      token: null,
    }),
    {
      name: "transfer-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
