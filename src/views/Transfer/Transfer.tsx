import { Container, Stack } from "@chakra-ui/react"

import { TransferBox } from "."

const Transfer = () => {
  return (
    <Container>
      <Stack alignItems="center" py={{ md: 16 }}>
        <TransferBox />
      </Stack>
    </Container>
  )
}

export default Transfer
