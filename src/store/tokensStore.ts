import { uniqBy } from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type TokensStorage = {
  addToken: (token: Token) => void
  removeToken: (token: Token) => void
  tokens: Token[]
}

export const useTokensStore = create<TokensStorage>()(
  persist(
    (set, get) => ({
      addToken: (token) => {
        const { tokens } = get()
        set({ tokens: uniqBy(tokens.concat(token), "address") })
      },
      removeToken: (token) => {
        const { tokens } = get()
        set({ tokens: tokens.filter((item) => item.address !== token.address) })
      },
      tokens: [],
    }),
    {
      name: "tokens-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
