import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WALLET_CONNECT_PROJECT_ID } from "config/env"
import { arbitrum, berachain, mainnet } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
  appName: "Kite Template",
  chains: [mainnet, arbitrum, berachain],
  projectId: WALLET_CONNECT_PROJECT_ID,
  ssr: false,
})
