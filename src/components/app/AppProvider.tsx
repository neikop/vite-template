import { ChakraProvider } from "@chakra-ui/react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClientProvider } from "@tanstack/react-query"
import { chakraSystem } from "components/ui/theme"
import { Toaster } from "components/ui/toaster"
import { queryClient } from "config/queryClient"
import { wagmiConfig } from "config/walletConnect"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"
import { WagmiProvider } from "wagmi"

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider value={chakraSystem}>
            <Toaster />
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
