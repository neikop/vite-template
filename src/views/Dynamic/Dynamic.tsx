import { Stack } from "@chakra-ui/react"

import { Pair } from "."

const Dynamic = () => {
  return (
    <Stack gap={2}>
      {["WBERA/HONEY", "USDC.e/WBERA", "USDC.e/HONEY"].map((pair) => {
        return <Pair key={pair} pair={pair} />
      })}
    </Stack>
  )
}

export default Dynamic
