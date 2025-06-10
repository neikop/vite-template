import { privateKeyToAccount } from "viem/accounts"

export const getRelayer = () => {
  const index = Math.round(Math.random())

  const privateKey = import.meta.env.VITE_RELAYER_KEY!.split(",")[index]
  const address = import.meta.env.VITE_RELAYER_KEY_ADDRESS!.split(",")[index]

  const account = privateKeyToAccount(privateKey)

  return {
    relayerAccount: account,
    relayerAddress: address,
  }
}
