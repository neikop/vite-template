import { Button, Center, Container, Flex, Stack, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { onematrix } from "components/common/ChainSelectPopover"
import { OFTAbi } from "contracts/abis"
import * as ethers from "ethers"
import { useState } from "react"
import { MdClearAll, MdSwapVert } from "react-icons/md"
import { useBridgeStore } from "store/bridgeStore"
import { createPublicClient, http } from "viem"
import { arbitrumSepolia } from "viem/chains"
import { useAccount, useWalletClient } from "wagmi"

const OFT_ADDRESS: Record<string, Address> = {
  [arbitrumSepolia.id]: "0x2dca5dab33c32ee5ccb31c0c02f017a31ee2d863",
  [onematrix.id]: "0x54Df67faa5eb03D02F91906F6D54bDC9184cE3c8",
}

const Bridge = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { clear, setInputChain, setOutputChain, setToken, swapChains } = useBridgeStore()
  const { inputChain, outputChain, token } = useBridgeStore()

  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount] = [inputAmount]

  const handleSubmit = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !inputChain || !outputChain) return

    const oftAddress = OFT_ADDRESS[inputChain.id]

    const dstEid = outputChain.id
    const to = address
    const tokensToSend = BigInt(parseFloat(inputAmount) * 10 ** token.decimals)

    // bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
    const options = "0x00030100110100000000000000000000000000030d40"

    const sendParam = [
      dstEid, // destination chain
      ethers.zeroPadValue(to, 32), // to
      tokensToSend, // token amount to send
      (tokensToSend * 9_900n) / 10_000n, // mint token amount
      options,
      "0x",
      "0x",
    ]

    const publicClient = createPublicClient({
      chain: inputChain,
      transport: http(),
    })

    const quoteSend = await publicClient.readContract({
      abi: OFTAbi,
      address: oftAddress,
      args: [sendParam, false],
      functionName: "quoteSend",
    })
    const fee = quoteSend as { lzTokenFee: bigint; nativeFee: bigint }

    const txHash = await walletClient.sendTransaction({
      abi: OFTAbi,
      account: address,
      address: oftAddress,
      args: [sendParam, fee, address],
      functionName: "send",
      value: fee.nativeFee,
    })

    console.log(`${chain?.blockExplorers?.default.url}/tx/${txHash}`)

    return txHash
  }

  const bridgeMutation = useMutation({
    mutationFn: handleSubmit,
  })

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
            <Button
              borderRadius={16}
              colorPalette="purple"
              loading={bridgeMutation.isPending}
              onClick={() => bridgeMutation.mutateAsync()}
              size="xl"
              variant="subtle"
            >
              Bridge
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Bridge
