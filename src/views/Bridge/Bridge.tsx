import { Button, Center, Container, Flex, Stack, Text } from "@chakra-ui/react"
import { ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { useState } from "react"
import { MdClearAll, MdSwapVert } from "react-icons/md"
import { useBridgeStore } from "store/bridgeStore"

const Bridge = () => {
  const { clear, inputChain, outputChain, setInputChain, setOutputChain, setToken, swapChains, token } =
    useBridgeStore()
  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount] = [inputAmount]

  const handleSubmit = () => {
    console.log(inputAmount)
    console.log(inputChain)
    console.log(outputChain)
    console.log(token)
  }

  const handleClear = () => {
    clear()
    setInputAmount("")
  }

  return (
    <Container>
      <Stack alignItems="center">
        <Stack borderRadius={16} borderWidth={1} p={4} w={420}>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Text fontWeight="bold">Bridge</Text>
              <TokenSelectDialog onChange={setToken} value={token} />
            </Flex>

            <Button h={8} minW={8} onClick={handleClear} p={1} variant="ghost">
              <MdClearAll />
            </Button>
          </Flex>

          <Stack gap={4} position="relative">
            <Stack backgroundColor="blackAlpha.50" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  From
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
                <NumericInput
                  border="none"
                  fontSize="2xl"
                  fontWeight="semibold"
                  h={8}
                  onChange={(event) => setInputAmount(event.target.value)}
                  p={0}
                  placeholder="0.0"
                  value={inputAmount}
                />

                <ChainSelectPopover onChange={setInputChain} value={inputChain} />
              </Flex>
            </Stack>

            <Flex justifyContent="center" position="absolute" top="50%" transform="translateY(-50%)" w="full">
              <Center backgroundColor="white" borderRadius={6} p={1}>
                <Button colorPalette="gray" onClick={swapChains} size="xs" variant="subtle">
                  <MdSwapVert />
                </Button>
              </Center>
            </Flex>

            <Stack backgroundColor="blackAlpha.50" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  To
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
                  value={outputAmount}
                />

                <ChainSelectPopover onChange={setOutputChain} value={outputChain} />
              </Flex>
            </Stack>
          </Stack>

          <Stack>
            <Button borderRadius={16} colorPalette="purple" onClick={handleSubmit} size="xl" variant="subtle">
              Bridge
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Bridge
