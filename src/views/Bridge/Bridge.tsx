import { Badge, Box, Button, Center, Container, Flex, Input, Popover, Portal, Stack, Text } from "@chakra-ui/react"
import { ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { MdExpandMore, MdSwapVert } from "react-icons/md"
import { NumericFormat } from "react-number-format"

const Bridge = () => {
  return (
    <Container>
      <Stack alignItems="center">
        <Stack borderRadius={16} borderWidth={1} p={4} w={420}>
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold">Bridge</Text>
            <TokenSelectDialog />
          </Flex>

          <Stack position="relative">
            <Stack backgroundColor="blackAlpha.50" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  You Pay
                </Text>
                <Flex gap={2}>
                  <Text fontSize="sm">Balance: 0</Text>
                  <Text
                    _hover={{ color: "purple.600" }}
                    color="purple.500"
                    cursor="pointer"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    Max
                  </Text>
                </Flex>
              </Flex>
              <Flex gap={2} justifyContent="space-between">
                <NumericInput border="none" fontSize="2xl" fontWeight="semibold" h={8} p={0} placeholder="0.0" />

                <ChainSelectPopover />
              </Flex>
            </Stack>
            <Flex justifyContent="center" position="absolute" top="50%" transform="translateY(-50%)" w="full">
              <Center backgroundColor="white" borderRadius={6} p={1}>
                <Button colorPalette="gray" size="xs" variant="subtle">
                  <MdSwapVert />
                </Button>
              </Center>
            </Flex>
            <Stack backgroundColor="blackAlpha.50" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  You Receive
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <NumericInput
                  border="none"
                  caretColor="transparent"
                  fontSize="2xl"
                  fontWeight="semibold"
                  h={8}
                  p={0}
                  placeholder="0.0"
                  readOnly={true}
                />

                <ChainSelectPopover />
              </Flex>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Bridge
