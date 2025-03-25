import { ChakraProvider } from "@chakra-ui/react"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClientProvider } from "@tanstack/react-query"
import { chakraSystem } from "components/ui/theme"
import { WALLET_CONNECT_PROJECT_ID } from "env"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"
import { queryClient } from "services/queryClient"
import { WagmiProvider } from "wagmi"
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains"

const config = getDefaultConfig({
  appName: "Kite Template",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  projectId: WALLET_CONNECT_PROJECT_ID,
  ssr: false,
})

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider value={chakraSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppProvider
