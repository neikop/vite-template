import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type AddressSignature = {
  address?: Address
  signature?: string
}

type MultiSignStorage = {
  setSignatures: (data: Array<AddressSignature>) => void
  signatures: Array<AddressSignature>
}

export const useMultiSignStore = create<MultiSignStorage>()(
  persist(
    (set, get) => ({
      setSignatures: (data) => {
        const { signatures } = get()
        if (data[0]) signatures[0] = data[0]
        if (data[1]) signatures[1] = data[1]
        set({ signatures: signatures.slice() })
      },
      signatures: [{}, {}],
    }),
    {
      name: "multisign-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
