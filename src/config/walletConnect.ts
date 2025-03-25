import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WALLET_CONNECT_PROJECT_ID } from "config/env"
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
  appName: "Kite Template",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  projectId: WALLET_CONNECT_PROJECT_ID,
  ssr: false,
})
