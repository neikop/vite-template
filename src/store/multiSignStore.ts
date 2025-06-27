import { Chain } from "@rainbow-me/rainbowkit"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type AddressSignature = {
  address?: Address
  signature?: string
}

type MultiSignStorage = {
  clear: () => void
  fromChain: Chain | null
  inputAmount: string
  receiveAddress: string
  setFromChain: (chain: Chain | null) => void
  setInputAmount: (value: string) => void
  setReceiveAddress: (address: string) => void
  setSignatures: (data: Array<AddressSignature>) => void
  setToken: (token: null | Token) => void
  signatures: Array<AddressSignature>
  token: null | Token
}

export const useMultiSignStore = create<MultiSignStorage>()(
  persist(
    (set, get) => ({
      clear: () => set({ fromChain: null, receiveAddress: "", signatures: [{}, {}], token: null }),
      fromChain: null,
      inputAmount: "",
      receiveAddress: "",
      setFromChain: (chain) => set({ fromChain: chain }),
      setInputAmount: (value) => set({ inputAmount: value }),
      setReceiveAddress: (address) => set({ receiveAddress: address }),
      setSignatures: (data) => {
        const { signatures } = get()
        if (data[0]) signatures[0] = data[0]
        if (data[1]) signatures[1] = data[1]
        set({ signatures: signatures.slice() })
      },
      setToken: (token) => set({ token }),
      signatures: [{}, {}],
      token: null,
    }),
    {
      name: "multisign-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
