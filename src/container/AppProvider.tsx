import { ChakraProvider } from "@chakra-ui/react"
import { chakraSystem } from "components/ui/theme"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider value={chakraSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default AppProvider
