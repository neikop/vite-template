import { Chain } from "@rainbow-me/rainbowkit"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type BridgeStorage = {
  clear: () => void
  inputChain: Chain | null
  outputChain: Chain | null
  setInputChain: (chain: Chain | null) => void
  setOutputChain: (chain: Chain | null) => void
  setToken: (token: null | Token) => void
  swapChains: () => { inputChain?: Chain | null; outputChain?: Chain | null }
  token: null | Token
}

export const useBridgeStore = create<BridgeStorage>()(
  persist(
    (set, get) => ({
      clear: () => set({ inputChain: null, outputChain: null, token: null }),
      inputChain: null,
      outputChain: null,
      setInputChain: (chain) => {
        const { inputChain, outputChain } = get()
        if (chain && chain.id === outputChain?.id) {
          set({ outputChain: inputChain })
        }
        set({ inputChain: chain })
      },
      setOutputChain: (chain) => {
        const { inputChain, outputChain } = get()
        if (chain && chain.id === inputChain?.id) {
          set({ inputChain: outputChain })
        }
        set({ outputChain: chain })
      },
      setToken: (token) => set({ token }),
      swapChains: () => {
        const { inputChain, outputChain } = get()
        set({ inputChain: outputChain, outputChain: inputChain })
        return { inputChain: outputChain, outputChain: inputChain }
      },
      token: null,
    }),
    {
      name: "bridge-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
