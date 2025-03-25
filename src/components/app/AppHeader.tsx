import { Box, Flex } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

const AppHeader = () => {
  return (
    <Flex gridArea="header" justifyContent="space-between" px={4} py={2}>
      <Box></Box>
      <ConnectButton />
    </Flex>
  )
}

export default AppHeader
