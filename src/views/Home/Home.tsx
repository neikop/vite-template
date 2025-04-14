import { Box, Stack } from "@chakra-ui/react"

import "./Home.scss"
import { Contact, Gretting, Intro, People, Register, Theme, Timeline } from "./components"
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
      <Register />
      <Contact />
    </Stack>
  )
}

export default Home
