import { Container, Flex, Stack, Tabs } from "@chakra-ui/react"
import { BridgeBox } from "views/Bridge"
import { TransferBox } from "views/Transfer"

const Home = () => {
  return (
    <Container>
      <Stack alignItems="center">
        <Tabs.Root defaultValue="transfer" variant="plain">
          <Flex justifyContent="center">
            <Tabs.List bg="bg.muted" p="1" rounded="l3">
              <Tabs.Trigger justifyContent="center" value="transfer" w={120}>
                Transfer
              </Tabs.Trigger>
              <Tabs.Trigger justifyContent="center" value="bridge" w={120}>
                Bridge
              </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>
          </Flex>
          <Tabs.Content value="transfer">
            <TransferBox />
          </Tabs.Content>
          <Tabs.Content value="bridge">
            <BridgeBox />
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Container>
  )
}

export default Home
