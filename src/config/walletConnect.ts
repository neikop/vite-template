import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WALLET_CONNECT_PROJECT_ID } from "config/env"
import { arbitrum, berachain, mainnet } from "wagmi/chains"

Object.assign(arbitrum, { iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png" })
Object.assign(mainnet, { iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" })
Object.assign(berachain, { iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/24647.png" })

export const wagmiConfig = getDefaultConfig({
  appName: "Kite Template",
  chains: [mainnet, arbitrum, berachain],
  projectId: WALLET_CONNECT_PROJECT_ID,
  ssr: false,
})
