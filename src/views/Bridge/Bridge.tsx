import { Container, Stack } from "@chakra-ui/react"

import { BridgeBox } from "."

const Bridge = () => {
  return (
    <Container>
      <Stack alignItems="center" py={16}>
        <BridgeBox />
      </Stack>
    </Container>
  )
}

export default Bridge
