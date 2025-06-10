import { Container, Stack } from "@chakra-ui/react"

import { MultiSignBox } from "."

const MultiSign = () => {
  return (
    <Container>
      <Stack alignItems="center" py={16}>
        <MultiSignBox />
      </Stack>
    </Container>
  )
}

export default MultiSign
