import { getPublicClient } from "config/walletConnect"
import { createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"

export const getRelayer = (chainId: number) => {
  const rand = Math.round(Math.random())

  const relayerKeys = import.meta.env.VITE_RELAYER_KEY!.split(",")
  const relayerAddresses = import.meta.env.VITE_RELAYER_KEY_ADDRESS!.split(",")

  const account = privateKeyToAccount(relayerKeys[rand])

  const client = createWalletClient({
    account,
    chain: getPublicClient(chainId).chain,
    transport: http(),
  })

  return {
    relayer: client,
    relayerAddress: relayerAddresses[rand],
  }
}
