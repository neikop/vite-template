import { Box, Stack } from "@chakra-ui/react"

import "./Home.scss"
import { Gretting, Intro, People, Theme, Timeline } from "./components"
import Prize from "./components/Prize"

const Home = () => {
  return (
    <Stack>
      <Gretting />
      <Intro />
      <Theme />
      <Prize />
      <People />
      <Timeline />

      <Box h={600} />
    </Stack>
  )
}

export default Home
